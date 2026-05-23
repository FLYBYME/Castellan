import { IServer } from '../core/server.js';
import { CastellanEngine } from '../engine/CastellanEngine.js';
import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fastifyWs from '@fastify/websocket';
import fastifyStatic from '@fastify/static';
import { WebSocket } from 'ws';
import { ICastellanApi } from '../core/api.js';
import path from 'path';
import fs from 'fs';

/**
 * GatewayServer: The standard HTTP/WebSocket transport for the Castellan Engine.
 * 
 * Mandate: Pure transport layer. Contains zero business logic.
 */
export class GatewayServer implements IServer {
    public readonly name = 'gateway';
    private fastify: FastifyInstance;

    constructor(private readonly port: number = 3000, private readonly host: string = '0.0.0.0') {
        this.fastify = Fastify({
            logger: {
                level: 'info',
                transport: { target: 'pino-pretty' }
            }
        });
    }

    /**
     * start: Boots the Fastify server and hooks it into the engine.
     */
    public async start(engine: CastellanEngine<ICastellanApi>): Promise<void> {
        await this.fastify.register(fastifyWs);

        // 1. Static Assets (Core UI)
        const clientPath = path.resolve('./dist/client');
        if (fs.existsSync(clientPath)) {
            await this.fastify.register(fastifyStatic, {
                root: clientPath,
                prefix: '/',
            });
        }

        // 2. Extension Bundles
        const extensionsPath = path.resolve('./dist/extensions');
        if (fs.existsSync(extensionsPath)) {
            await this.fastify.register(fastifyStatic, {
                root: extensionsPath,
                prefix: '/extensions/',
                decorateReply: false, // Prevent decoration conflicts with root static
            });
        }

        // 3. System Endpoints
        this.fastify.get('/api/system/extensions', async () => {
            const manifestPath = path.join(extensionsPath, 'manifest.json');
            if (fs.existsSync(manifestPath)) {
                return JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
            }
            return [];
        });

        // 4. WebSocket Hub
        this.fastify.register(async (instance) => {
            const handleConnection = (socket: WebSocket, req: FastifyRequest) => {
                const query = req.query as Record<string, unknown>;
                const sandboxId = typeof query['sandboxId'] === 'string' ? query['sandboxId'] : undefined;
                const correlationId = typeof query['correlationId'] === 'string' ? query['correlationId'] : undefined;

                const cleanup = engine.events.subscribeAll((name, payload, correlation) => {
                    socket.send(JSON.stringify({
                        type: 'event',
                        name,
                        payload,
                        correlationId: correlation
                    }));
                });

                socket.on('message', async (message: Buffer) => {
                    let requestId: unknown;
                    try {
                        const data = JSON.parse(message.toString()) as Record<string, unknown>;
                        console.log('Received message:', data);
                        if (data['type'] === 'tool_exec') {
                            const domain = String(data['domain']);
                            const action = String(data['action']);
                            const input = data['input'];
                            requestId = data['requestId'];

                            // Hollow API for transport boundary
                            const context = engine.createContext(undefined, correlationId, sandboxId);

                            const result = await engine.executor.execute(domain, action, input, context);
                            socket.send(JSON.stringify({ type: 'tool_result', requestId, data: result }));
                        }
                    } catch (err) {
                        const data = message.length > 0 ? (tryParse(message.toString()) as Record<string, unknown>) : null;
                        socket.send(JSON.stringify({
                            type: 'error',
                            error: err instanceof Error ? err.message : String(err),
                            requestId,
                            context: data ? {
                                domain: data['domain'],
                                action: data['action'],
                                input: data['input']
                            } : undefined
                        }));
                    }
                });

                socket.on('close', cleanup);
            };

            instance.get('/ws', { websocket: true }, handleConnection);
            instance.get('/api/v2/ws', { websocket: true }, handleConnection);
        });

        // 5. REST API Bridge
        this.fastify.get('/api/health', async () => ({ status: 'ok', engine: 'active' }));

        for (const skill of engine.registry.allSkills()) {
            for (const contract of skill.getContracts()) {
                const { method, path } = contract.rest;

                this.fastify.route({
                    method: method as "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
                    url: `/api${path}`,
                    handler: async (request: FastifyRequest, reply: FastifyReply) => {
                        const input = {
                            ...(request.params as object),
                            ...(request.query as object),
                            ...(request.body as object)
                        };

                        const correlationId = (request.headers['x-correlation-id'] as string) || undefined;
                        const context = engine.createContext(undefined, correlationId);

                        try {
                            return await engine.executor.execute(contract.domain, contract.action, input, context);
                        } catch (err) {
                            void reply.status(400).send({
                                error: err instanceof Error ? err.message : String(err),
                                domain: contract.domain,
                                action: contract.action
                            });
                        }
                    }
                });
            }
        }

        await this.fastify.listen({ port: this.port, host: this.host });
        console.log(`[Gateway] Server active at http://${this.host}:${this.port}`);
    }

    public async stop(): Promise<void> {
        await this.fastify.close();
    }
}

function tryParse(str: string): unknown {
    try {
        return JSON.parse(str);
    } catch {
        return null;
    }
}
