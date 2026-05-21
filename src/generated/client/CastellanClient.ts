import { z } from 'zod';
import { BaseClient } from '@castellan/core/index.js';
import * as Contract_0 from '../../addons/agents/skills/agent.contract.js';
import * as Contract_1 from '../../addons/audit/skills/approval.contract.js';
import * as Contract_2 from '../../addons/cron/skills/cron.contract.js';
import * as Contract_3 from '../../addons/demo/skills/demo.contract.js';
import * as Contract_4 from '../../addons/infer/skills/infer.contract.js';
import * as Contract_5 from '../../addons/marketplace/skills/marketplace.contract.js';
import * as Contract_6 from '../../addons/notifications/skills/notifications.contract.js';
import * as Contract_7 from '../../addons/sandbox/skills/sandbox.contract.js';
import * as Contract_8 from '../../addons/settings/skills/settings.contract.js';

export class CastellanClient extends BaseClient {
    protected async getWebSocket(): Promise<any> {
        const getWsState = (ws: any) => {
            if (!ws) return 3; // CLOSED
            return typeof ws.readyState !== 'undefined' ? ws.readyState : (ws as any).status;
        };
        const state = getWsState(this.socket);
        if (this.socket && state === 1) return this.socket; // 1 = OPEN
        if (this.connectingPromise && (state === 0 || state === 1)) return this.connectingPromise; // 0 = CONNECTING
        
        this.connectingPromise = new Promise(async (resolve, reject) => {
            try {
                const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
                const WS = isNode ? (await import('ws')).default : WebSocket;
                let url = this.serverUrl.replace(/^http/, 'ws');
                if (!url.endsWith('/ws')) url += '/ws';
                if (this.sandboxId) url += `?sandboxId=${this.sandboxId}`;
                const ws = new (WS as any)(url);
                const cleanup = () => { this.connectingPromise = null; };
                let resolved = false;
                const onOpen = () => { resolved = true; this.socket = ws; cleanup(); resolve(ws); };
                const onMessage = (e: any) => this.handleIncomingMessage(isNode ? e : e.data);
                const onError = (e: any) => { cleanup(); reject(e); };
                const onClose = () => { this.socket = null; cleanup(); if (!resolved) reject(new Error('WebSocket closed before connection could be established')); };
                if (isNode) { ws.on('open', onOpen); ws.on('message', onMessage); ws.on('error', onError); ws.on('close', onClose); }
                else { ws.onopen = onOpen; ws.onmessage = onMessage; ws.onerror = onError; ws.onclose = onClose; }
            } catch (err) { this.connectingPromise = null; reject(err); }
        });
        return this.connectingPromise;
    }

    protected send(ws: any, payload: any): void {
        ws.send(JSON.stringify(payload));
    }

    public async connect(): Promise<void> { await this.getWebSocket(); }

    public close(): void { if (this.socket) { (this.socket as any).close(); this.socket = null; } }

    public readonly api = {
        agent: {
            run: (args: z.input<typeof Contract_0.agentRunContract['inputSchema']>): Promise<z.infer<typeof Contract_0.agentRunContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.agentRunContract['outputSchema']>>('agent_run', args, Contract_0.agentRunContract.outputSchema),
            create: (args: z.input<typeof Contract_0.agentCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.agentCrud['create']['outputSchema']>>('agent_create', args, Contract_0.agentCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_0.agentCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.agentCrud['find']['outputSchema']>>('agent_find', args, Contract_0.agentCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_0.agentCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.agentCrud['findOne']['outputSchema']>>('agent_find_one', args, Contract_0.agentCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_0.agentCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.agentCrud['count']['outputSchema']>>('agent_count', args, Contract_0.agentCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_0.agentCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.agentCrud['get']['outputSchema']>>('agent_get', args, Contract_0.agentCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_0.agentCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.agentCrud['update']['outputSchema']>>('agent_update', args, Contract_0.agentCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_0.agentCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.agentCrud['delete']['outputSchema']>>('agent_delete', args, Contract_0.agentCrud['delete'].outputSchema),
        },
        agent_run: {
            create: (args: z.input<typeof Contract_0.agentRunCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentRunCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.agentRunCrud['create']['outputSchema']>>('agent_run_create', args, Contract_0.agentRunCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_0.agentRunCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentRunCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.agentRunCrud['find']['outputSchema']>>('agent_run_find', args, Contract_0.agentRunCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_0.agentRunCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentRunCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.agentRunCrud['findOne']['outputSchema']>>('agent_run_find_one', args, Contract_0.agentRunCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_0.agentRunCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentRunCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.agentRunCrud['count']['outputSchema']>>('agent_run_count', args, Contract_0.agentRunCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_0.agentRunCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentRunCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.agentRunCrud['get']['outputSchema']>>('agent_run_get', args, Contract_0.agentRunCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_0.agentRunCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentRunCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.agentRunCrud['update']['outputSchema']>>('agent_run_update', args, Contract_0.agentRunCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_0.agentRunCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_0.agentRunCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_0.agentRunCrud['delete']['outputSchema']>>('agent_run_delete', args, Contract_0.agentRunCrud['delete'].outputSchema),
        },
        audit: {
            approval_resolve: (args: z.input<typeof Contract_1.approvalResolveContract['inputSchema']>): Promise<z.infer<typeof Contract_1.approvalResolveContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.approvalResolveContract['outputSchema']>>('audit_approval_resolve', args, Contract_1.approvalResolveContract.outputSchema),
            run: (args: z.input<typeof Contract_1.auditRunContract['inputSchema']>): Promise<z.infer<typeof Contract_1.auditRunContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.auditRunContract['outputSchema']>>('audit_run', args, Contract_1.auditRunContract.outputSchema),
            create_testbed: (args: z.input<typeof Contract_1.auditCreateTestbedContract['inputSchema']>): Promise<z.infer<typeof Contract_1.auditCreateTestbedContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.auditCreateTestbedContract['outputSchema']>>('audit_create_testbed', args, Contract_1.auditCreateTestbedContract.outputSchema),
            generate_scenario: (args: z.input<typeof Contract_1.auditGenerateScenarioContract['inputSchema']>): Promise<z.infer<typeof Contract_1.auditGenerateScenarioContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.auditGenerateScenarioContract['outputSchema']>>('audit_generate_scenario', args, Contract_1.auditGenerateScenarioContract.outputSchema),
            evaluate_triad: (args: z.input<typeof Contract_1.auditEvaluateTriadContract['inputSchema']>): Promise<z.infer<typeof Contract_1.auditEvaluateTriadContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.auditEvaluateTriadContract['outputSchema']>>('audit_evaluate_triad', args, Contract_1.auditEvaluateTriadContract.outputSchema),
            evaluate_approval: (args: z.input<typeof Contract_1.auditEvaluateApprovalContract['inputSchema']>): Promise<z.infer<typeof Contract_1.auditEvaluateApprovalContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.auditEvaluateApprovalContract['outputSchema']>>('audit_evaluate_approval', args, Contract_1.auditEvaluateApprovalContract.outputSchema),
        },
        approval: {
            create: (args: z.input<typeof Contract_1.approvalCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_1.approvalCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.approvalCrud['create']['outputSchema']>>('approval_create', args, Contract_1.approvalCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_1.approvalCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_1.approvalCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.approvalCrud['find']['outputSchema']>>('approval_find', args, Contract_1.approvalCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_1.approvalCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_1.approvalCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.approvalCrud['findOne']['outputSchema']>>('approval_find_one', args, Contract_1.approvalCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_1.approvalCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_1.approvalCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.approvalCrud['count']['outputSchema']>>('approval_count', args, Contract_1.approvalCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_1.approvalCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_1.approvalCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.approvalCrud['get']['outputSchema']>>('approval_get', args, Contract_1.approvalCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_1.approvalCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_1.approvalCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.approvalCrud['update']['outputSchema']>>('approval_update', args, Contract_1.approvalCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_1.approvalCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_1.approvalCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.approvalCrud['delete']['outputSchema']>>('approval_delete', args, Contract_1.approvalCrud['delete'].outputSchema),
        },
        scenario: {
            create: (args: z.input<typeof Contract_1.scenarioCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_1.scenarioCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.scenarioCrud['create']['outputSchema']>>('scenario_create', args, Contract_1.scenarioCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_1.scenarioCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_1.scenarioCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.scenarioCrud['find']['outputSchema']>>('scenario_find', args, Contract_1.scenarioCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_1.scenarioCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_1.scenarioCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.scenarioCrud['findOne']['outputSchema']>>('scenario_find_one', args, Contract_1.scenarioCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_1.scenarioCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_1.scenarioCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.scenarioCrud['count']['outputSchema']>>('scenario_count', args, Contract_1.scenarioCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_1.scenarioCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_1.scenarioCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.scenarioCrud['get']['outputSchema']>>('scenario_get', args, Contract_1.scenarioCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_1.scenarioCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_1.scenarioCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.scenarioCrud['update']['outputSchema']>>('scenario_update', args, Contract_1.scenarioCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_1.scenarioCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_1.scenarioCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.scenarioCrud['delete']['outputSchema']>>('scenario_delete', args, Contract_1.scenarioCrud['delete'].outputSchema),
        },
        evaluation: {
            create: (args: z.input<typeof Contract_1.evaluationCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_1.evaluationCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.evaluationCrud['create']['outputSchema']>>('evaluation_create', args, Contract_1.evaluationCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_1.evaluationCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_1.evaluationCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.evaluationCrud['find']['outputSchema']>>('evaluation_find', args, Contract_1.evaluationCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_1.evaluationCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_1.evaluationCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.evaluationCrud['findOne']['outputSchema']>>('evaluation_find_one', args, Contract_1.evaluationCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_1.evaluationCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_1.evaluationCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.evaluationCrud['count']['outputSchema']>>('evaluation_count', args, Contract_1.evaluationCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_1.evaluationCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_1.evaluationCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.evaluationCrud['get']['outputSchema']>>('evaluation_get', args, Contract_1.evaluationCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_1.evaluationCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_1.evaluationCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.evaluationCrud['update']['outputSchema']>>('evaluation_update', args, Contract_1.evaluationCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_1.evaluationCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_1.evaluationCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_1.evaluationCrud['delete']['outputSchema']>>('evaluation_delete', args, Contract_1.evaluationCrud['delete'].outputSchema),
        },
        cron: {
            trigger: (args: z.input<typeof Contract_2.cronTriggerContract['inputSchema']>): Promise<z.infer<typeof Contract_2.cronTriggerContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_2.cronTriggerContract['outputSchema']>>('cron_trigger', args, Contract_2.cronTriggerContract.outputSchema),
            reset: (args: z.input<typeof Contract_2.cronResetContract['inputSchema']>): Promise<z.infer<typeof Contract_2.cronResetContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_2.cronResetContract['outputSchema']>>('cron_reset', args, Contract_2.cronResetContract.outputSchema),
            status: (args: z.input<typeof Contract_2.cronStatusContract['inputSchema']>): Promise<z.infer<typeof Contract_2.cronStatusContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_2.cronStatusContract['outputSchema']>>('cron_status', args, Contract_2.cronStatusContract.outputSchema),
            create: (args: z.input<typeof Contract_2.cronJobCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_2.cronJobCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_2.cronJobCrud['create']['outputSchema']>>('cron_create', args, Contract_2.cronJobCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_2.cronJobCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_2.cronJobCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_2.cronJobCrud['find']['outputSchema']>>('cron_find', args, Contract_2.cronJobCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_2.cronJobCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_2.cronJobCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_2.cronJobCrud['findOne']['outputSchema']>>('cron_find_one', args, Contract_2.cronJobCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_2.cronJobCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_2.cronJobCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_2.cronJobCrud['count']['outputSchema']>>('cron_count', args, Contract_2.cronJobCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_2.cronJobCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_2.cronJobCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_2.cronJobCrud['get']['outputSchema']>>('cron_get', args, Contract_2.cronJobCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_2.cronJobCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_2.cronJobCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_2.cronJobCrud['update']['outputSchema']>>('cron_update', args, Contract_2.cronJobCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_2.cronJobCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_2.cronJobCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_2.cronJobCrud['delete']['outputSchema']>>('cron_delete', args, Contract_2.cronJobCrud['delete'].outputSchema),
        },
        cron_runs: {
            create: (args: z.input<typeof Contract_2.cronJobRunCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_2.cronJobRunCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_2.cronJobRunCrud['create']['outputSchema']>>('cron_runs_create', args, Contract_2.cronJobRunCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_2.cronJobRunCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_2.cronJobRunCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_2.cronJobRunCrud['find']['outputSchema']>>('cron_runs_find', args, Contract_2.cronJobRunCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_2.cronJobRunCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_2.cronJobRunCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_2.cronJobRunCrud['findOne']['outputSchema']>>('cron_runs_find_one', args, Contract_2.cronJobRunCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_2.cronJobRunCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_2.cronJobRunCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_2.cronJobRunCrud['count']['outputSchema']>>('cron_runs_count', args, Contract_2.cronJobRunCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_2.cronJobRunCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_2.cronJobRunCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_2.cronJobRunCrud['get']['outputSchema']>>('cron_runs_get', args, Contract_2.cronJobRunCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_2.cronJobRunCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_2.cronJobRunCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_2.cronJobRunCrud['update']['outputSchema']>>('cron_runs_update', args, Contract_2.cronJobRunCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_2.cronJobRunCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_2.cronJobRunCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_2.cronJobRunCrud['delete']['outputSchema']>>('cron_runs_delete', args, Contract_2.cronJobRunCrud['delete'].outputSchema),
        },
        demo: {
            hello: (args: z.input<typeof Contract_3.demoHelloContract['inputSchema']>): Promise<z.infer<typeof Contract_3.demoHelloContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.demoHelloContract['outputSchema']>>('demo_hello', args, Contract_3.demoHelloContract.outputSchema),
            status: (args: z.input<typeof Contract_3.demoStatusContract['inputSchema']>): Promise<z.infer<typeof Contract_3.demoStatusContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.demoStatusContract['outputSchema']>>('demo_status', args, Contract_3.demoStatusContract.outputSchema),
            notify: (args: z.input<typeof Contract_3.demoNotifyContract['inputSchema']>): Promise<z.infer<typeof Contract_3.demoNotifyContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.demoNotifyContract['outputSchema']>>('demo_notify', args, Contract_3.demoNotifyContract.outputSchema),
            create: (args: z.input<typeof Contract_3.demoCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_3.demoCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.demoCrud['create']['outputSchema']>>('demo_create', args, Contract_3.demoCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_3.demoCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_3.demoCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.demoCrud['find']['outputSchema']>>('demo_find', args, Contract_3.demoCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_3.demoCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_3.demoCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.demoCrud['findOne']['outputSchema']>>('demo_find_one', args, Contract_3.demoCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_3.demoCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_3.demoCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.demoCrud['count']['outputSchema']>>('demo_count', args, Contract_3.demoCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_3.demoCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_3.demoCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.demoCrud['get']['outputSchema']>>('demo_get', args, Contract_3.demoCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_3.demoCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_3.demoCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.demoCrud['update']['outputSchema']>>('demo_update', args, Contract_3.demoCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_3.demoCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_3.demoCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_3.demoCrud['delete']['outputSchema']>>('demo_delete', args, Contract_3.demoCrud['delete'].outputSchema),
        },
        infer: {
            chat: (args: z.input<typeof Contract_4.inferChatContract['inputSchema']>): Promise<z.infer<typeof Contract_4.inferChatContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.inferChatContract['outputSchema']>>('infer_chat', args, Contract_4.inferChatContract.outputSchema),
            approve_tool: (args: z.input<typeof Contract_4.inferApproveToolContract['inputSchema']>): Promise<z.infer<typeof Contract_4.inferApproveToolContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.inferApproveToolContract['outputSchema']>>('infer_approve_tool', args, Contract_4.inferApproveToolContract.outputSchema),
            refresh_inventory: (args: z.input<typeof Contract_4.inferRefreshInventoryContract['inputSchema']>): Promise<z.infer<typeof Contract_4.inferRefreshInventoryContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.inferRefreshInventoryContract['outputSchema']>>('infer_refresh_inventory', args, Contract_4.inferRefreshInventoryContract.outputSchema),
            acquire_ollama: (args: z.input<typeof Contract_4.inferAcquireOllamaContract['inputSchema']>): Promise<z.infer<typeof Contract_4.inferAcquireOllamaContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.inferAcquireOllamaContract['outputSchema']>>('infer_acquire_ollama', args, Contract_4.inferAcquireOllamaContract.outputSchema),
            release_ollama: (args: z.input<typeof Contract_4.inferReleaseOllamaContract['inputSchema']>): Promise<z.infer<typeof Contract_4.inferReleaseOllamaContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.inferReleaseOllamaContract['outputSchema']>>('infer_release_ollama', args, Contract_4.inferReleaseOllamaContract.outputSchema),
        },
        ollama: {
            create: (args: z.input<typeof Contract_4.ollamaCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_4.ollamaCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.ollamaCrud['create']['outputSchema']>>('ollama_create', args, Contract_4.ollamaCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_4.ollamaCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_4.ollamaCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.ollamaCrud['find']['outputSchema']>>('ollama_find', args, Contract_4.ollamaCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_4.ollamaCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_4.ollamaCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.ollamaCrud['findOne']['outputSchema']>>('ollama_find_one', args, Contract_4.ollamaCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_4.ollamaCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_4.ollamaCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.ollamaCrud['count']['outputSchema']>>('ollama_count', args, Contract_4.ollamaCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_4.ollamaCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_4.ollamaCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.ollamaCrud['get']['outputSchema']>>('ollama_get', args, Contract_4.ollamaCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_4.ollamaCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_4.ollamaCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.ollamaCrud['update']['outputSchema']>>('ollama_update', args, Contract_4.ollamaCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_4.ollamaCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_4.ollamaCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.ollamaCrud['delete']['outputSchema']>>('ollama_delete', args, Contract_4.ollamaCrud['delete'].outputSchema),
        },
        models: {
            create: (args: z.input<typeof Contract_4.modelCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_4.modelCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.modelCrud['create']['outputSchema']>>('models_create', args, Contract_4.modelCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_4.modelCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_4.modelCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.modelCrud['find']['outputSchema']>>('models_find', args, Contract_4.modelCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_4.modelCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_4.modelCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.modelCrud['findOne']['outputSchema']>>('models_find_one', args, Contract_4.modelCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_4.modelCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_4.modelCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.modelCrud['count']['outputSchema']>>('models_count', args, Contract_4.modelCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_4.modelCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_4.modelCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.modelCrud['get']['outputSchema']>>('models_get', args, Contract_4.modelCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_4.modelCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_4.modelCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.modelCrud['update']['outputSchema']>>('models_update', args, Contract_4.modelCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_4.modelCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_4.modelCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.modelCrud['delete']['outputSchema']>>('models_delete', args, Contract_4.modelCrud['delete'].outputSchema),
        },
        threads: {
            create: (args: z.input<typeof Contract_4.threadCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_4.threadCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.threadCrud['create']['outputSchema']>>('threads_create', args, Contract_4.threadCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_4.threadCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_4.threadCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.threadCrud['find']['outputSchema']>>('threads_find', args, Contract_4.threadCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_4.threadCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_4.threadCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.threadCrud['findOne']['outputSchema']>>('threads_find_one', args, Contract_4.threadCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_4.threadCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_4.threadCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.threadCrud['count']['outputSchema']>>('threads_count', args, Contract_4.threadCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_4.threadCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_4.threadCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.threadCrud['get']['outputSchema']>>('threads_get', args, Contract_4.threadCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_4.threadCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_4.threadCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.threadCrud['update']['outputSchema']>>('threads_update', args, Contract_4.threadCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_4.threadCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_4.threadCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.threadCrud['delete']['outputSchema']>>('threads_delete', args, Contract_4.threadCrud['delete'].outputSchema),
        },
        messages: {
            create: (args: z.input<typeof Contract_4.messageCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_4.messageCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.messageCrud['create']['outputSchema']>>('messages_create', args, Contract_4.messageCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_4.messageCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_4.messageCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.messageCrud['find']['outputSchema']>>('messages_find', args, Contract_4.messageCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_4.messageCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_4.messageCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.messageCrud['findOne']['outputSchema']>>('messages_find_one', args, Contract_4.messageCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_4.messageCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_4.messageCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.messageCrud['count']['outputSchema']>>('messages_count', args, Contract_4.messageCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_4.messageCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_4.messageCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.messageCrud['get']['outputSchema']>>('messages_get', args, Contract_4.messageCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_4.messageCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_4.messageCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.messageCrud['update']['outputSchema']>>('messages_update', args, Contract_4.messageCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_4.messageCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_4.messageCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.messageCrud['delete']['outputSchema']>>('messages_delete', args, Contract_4.messageCrud['delete'].outputSchema),
        },
        tool_calls: {
            create: (args: z.input<typeof Contract_4.toolCallCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_4.toolCallCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.toolCallCrud['create']['outputSchema']>>('tool_calls_create', args, Contract_4.toolCallCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_4.toolCallCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_4.toolCallCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.toolCallCrud['find']['outputSchema']>>('tool_calls_find', args, Contract_4.toolCallCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_4.toolCallCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_4.toolCallCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.toolCallCrud['findOne']['outputSchema']>>('tool_calls_find_one', args, Contract_4.toolCallCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_4.toolCallCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_4.toolCallCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.toolCallCrud['count']['outputSchema']>>('tool_calls_count', args, Contract_4.toolCallCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_4.toolCallCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_4.toolCallCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.toolCallCrud['get']['outputSchema']>>('tool_calls_get', args, Contract_4.toolCallCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_4.toolCallCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_4.toolCallCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.toolCallCrud['update']['outputSchema']>>('tool_calls_update', args, Contract_4.toolCallCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_4.toolCallCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_4.toolCallCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_4.toolCallCrud['delete']['outputSchema']>>('tool_calls_delete', args, Contract_4.toolCallCrud['delete'].outputSchema),
        },
        marketplace: {
            list: (args: z.input<typeof Contract_5.marketplaceListContract['inputSchema']>): Promise<z.infer<typeof Contract_5.marketplaceListContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_5.marketplaceListContract['outputSchema']>>('marketplace_list', args, Contract_5.marketplaceListContract.outputSchema),
            install: (args: z.input<typeof Contract_5.marketplaceInstallContract['inputSchema']>): Promise<z.infer<typeof Contract_5.marketplaceInstallContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_5.marketplaceInstallContract['outputSchema']>>('marketplace_install', args, Contract_5.marketplaceInstallContract.outputSchema),
        },
        notifications: {
            send: (args: z.input<typeof Contract_6.notificationsSendContract['inputSchema']>): Promise<z.infer<typeof Contract_6.notificationsSendContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_6.notificationsSendContract['outputSchema']>>('notifications_send', args, Contract_6.notificationsSendContract.outputSchema),
            list: (args: z.input<typeof Contract_6.notificationsListContract['inputSchema']>): Promise<z.infer<typeof Contract_6.notificationsListContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_6.notificationsListContract['outputSchema']>>('notifications_list', args, Contract_6.notificationsListContract.outputSchema),
        },
        sandbox: {
            set_active: (args: z.input<typeof Contract_7.sandboxSetActiveContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxSetActiveContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxSetActiveContract['outputSchema']>>('sandbox_set_active', args, Contract_7.sandboxSetActiveContract.outputSchema),
            prune: (args: z.input<typeof Contract_7.sandboxPruneContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxPruneContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxPruneContract['outputSchema']>>('sandbox_prune', args, Contract_7.sandboxPruneContract.outputSchema),
            fs_read: (args: z.input<typeof Contract_7.sandboxFsReadContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxFsReadContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxFsReadContract['outputSchema']>>('sandbox_fs_read', args, Contract_7.sandboxFsReadContract.outputSchema),
            fs_write: (args: z.input<typeof Contract_7.sandboxFsWriteContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxFsWriteContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxFsWriteContract['outputSchema']>>('sandbox_fs_write', args, Contract_7.sandboxFsWriteContract.outputSchema),
            fs_list: (args: z.input<typeof Contract_7.sandboxFsListContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxFsListContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxFsListContract['outputSchema']>>('sandbox_fs_list', args, Contract_7.sandboxFsListContract.outputSchema),
            fs_patch: (args: z.input<typeof Contract_7.sandboxFsPatchContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxFsPatchContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxFsPatchContract['outputSchema']>>('sandbox_fs_patch', args, Contract_7.sandboxFsPatchContract.outputSchema),
            fs_remove: (args: z.input<typeof Contract_7.sandboxFsRemoveContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxFsRemoveContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxFsRemoveContract['outputSchema']>>('sandbox_fs_remove', args, Contract_7.sandboxFsRemoveContract.outputSchema),
            fs_mkdir: (args: z.input<typeof Contract_7.sandboxFsMkdirContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxFsMkdirContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxFsMkdirContract['outputSchema']>>('sandbox_fs_mkdir', args, Contract_7.sandboxFsMkdirContract.outputSchema),
            fs_move: (args: z.input<typeof Contract_7.sandboxFsMoveContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxFsMoveContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxFsMoveContract['outputSchema']>>('sandbox_fs_move', args, Contract_7.sandboxFsMoveContract.outputSchema),
            terminal_execute: (args: z.input<typeof Contract_7.sandboxTerminalExecuteContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxTerminalExecuteContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxTerminalExecuteContract['outputSchema']>>('sandbox_terminal_execute', args, Contract_7.sandboxTerminalExecuteContract.outputSchema),
            terminal_spawn: (args: z.input<typeof Contract_7.sandboxTerminalSpawnContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxTerminalSpawnContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxTerminalSpawnContract['outputSchema']>>('sandbox_terminal_spawn', args, Contract_7.sandboxTerminalSpawnContract.outputSchema),
            terminal_list: (args: z.input<typeof Contract_7.sandboxTerminalListContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxTerminalListContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxTerminalListContract['outputSchema']>>('sandbox_terminal_list', args, Contract_7.sandboxTerminalListContract.outputSchema),
            terminal_kill: (args: z.input<typeof Contract_7.sandboxTerminalKillContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxTerminalKillContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxTerminalKillContract['outputSchema']>>('sandbox_terminal_kill', args, Contract_7.sandboxTerminalKillContract.outputSchema),
            terminal_logs: (args: z.input<typeof Contract_7.sandboxTerminalLogsContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxTerminalLogsContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxTerminalLogsContract['outputSchema']>>('sandbox_terminal_logs', args, Contract_7.sandboxTerminalLogsContract.outputSchema),
            terminal_session_open: (args: z.input<typeof Contract_7.sandboxTerminalSessionOpenContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxTerminalSessionOpenContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxTerminalSessionOpenContract['outputSchema']>>('sandbox_terminal_session_open', args, Contract_7.sandboxTerminalSessionOpenContract.outputSchema),
            terminal_session_list: (args: z.input<typeof Contract_7.sandboxTerminalSessionListContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxTerminalSessionListContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxTerminalSessionListContract['outputSchema']>>('sandbox_terminal_session_list', args, Contract_7.sandboxTerminalSessionListContract.outputSchema),
            terminal_session_write: (args: z.input<typeof Contract_7.sandboxTerminalSessionWriteContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxTerminalSessionWriteContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxTerminalSessionWriteContract['outputSchema']>>('sandbox_terminal_session_write', args, Contract_7.sandboxTerminalSessionWriteContract.outputSchema),
            terminal_session_resize: (args: z.input<typeof Contract_7.sandboxTerminalSessionResizeContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxTerminalSessionResizeContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxTerminalSessionResizeContract['outputSchema']>>('sandbox_terminal_session_resize', args, Contract_7.sandboxTerminalSessionResizeContract.outputSchema),
            network_expose: (args: z.input<typeof Contract_7.sandboxNetworkExposeContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxNetworkExposeContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxNetworkExposeContract['outputSchema']>>('sandbox_network_expose', args, Contract_7.sandboxNetworkExposeContract.outputSchema),
            network_unexpose: (args: z.input<typeof Contract_7.sandboxNetworkUnexposeContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxNetworkUnexposeContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxNetworkUnexposeContract['outputSchema']>>('sandbox_network_unexpose', args, Contract_7.sandboxNetworkUnexposeContract.outputSchema),
            network_list: (args: z.input<typeof Contract_7.sandboxNetworkListContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxNetworkListContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxNetworkListContract['outputSchema']>>('sandbox_network_list', args, Contract_7.sandboxNetworkListContract.outputSchema),
            network_set_policy: (args: z.input<typeof Contract_7.sandboxNetworkSetPolicyContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxNetworkSetPolicyContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxNetworkSetPolicyContract['outputSchema']>>('sandbox_network_set_policy', args, Contract_7.sandboxNetworkSetPolicyContract.outputSchema),
            env_set: (args: z.input<typeof Contract_7.sandboxEnvSetContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxEnvSetContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxEnvSetContract['outputSchema']>>('sandbox_env_set', args, Contract_7.sandboxEnvSetContract.outputSchema),
            env_set_secret: (args: z.input<typeof Contract_7.sandboxEnvSetSecretContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxEnvSetSecretContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxEnvSetSecretContract['outputSchema']>>('sandbox_env_set_secret', args, Contract_7.sandboxEnvSetSecretContract.outputSchema),
            env_list: (args: z.input<typeof Contract_7.sandboxEnvListContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxEnvListContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxEnvListContract['outputSchema']>>('sandbox_env_list', args, Contract_7.sandboxEnvListContract.outputSchema),
            resource_update_limits: (args: z.input<typeof Contract_7.sandboxResourceUpdateLimitsContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxResourceUpdateLimitsContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxResourceUpdateLimitsContract['outputSchema']>>('sandbox_resource_update_limits', args, Contract_7.sandboxResourceUpdateLimitsContract.outputSchema),
            resource_get_stats: (args: z.input<typeof Contract_7.sandboxResourceGetStatsContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxResourceGetStatsContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxResourceGetStatsContract['outputSchema']>>('sandbox_resource_get_stats', args, Contract_7.sandboxResourceGetStatsContract.outputSchema),
            state_commit: (args: z.input<typeof Contract_7.sandboxStateCommitContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxStateCommitContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxStateCommitContract['outputSchema']>>('sandbox_state_commit', args, Contract_7.sandboxStateCommitContract.outputSchema),
            state_clone: (args: z.input<typeof Contract_7.sandboxStateCloneContract['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxStateCloneContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxStateCloneContract['outputSchema']>>('sandbox_state_clone', args, Contract_7.sandboxStateCloneContract.outputSchema),
            create: (args: z.input<typeof Contract_7.sandboxCrud['create']['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxCrud['create']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxCrud['create']['outputSchema']>>('sandbox_create', args, Contract_7.sandboxCrud['create'].outputSchema),
            find: (args: z.input<typeof Contract_7.sandboxCrud['find']['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxCrud['find']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxCrud['find']['outputSchema']>>('sandbox_find', args, Contract_7.sandboxCrud['find'].outputSchema),
            find_one: (args: z.input<typeof Contract_7.sandboxCrud['findOne']['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxCrud['findOne']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxCrud['findOne']['outputSchema']>>('sandbox_find_one', args, Contract_7.sandboxCrud['findOne'].outputSchema),
            count: (args: z.input<typeof Contract_7.sandboxCrud['count']['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxCrud['count']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxCrud['count']['outputSchema']>>('sandbox_count', args, Contract_7.sandboxCrud['count'].outputSchema),
            get: (args: z.input<typeof Contract_7.sandboxCrud['get']['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxCrud['get']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxCrud['get']['outputSchema']>>('sandbox_get', args, Contract_7.sandboxCrud['get'].outputSchema),
            update: (args: z.input<typeof Contract_7.sandboxCrud['update']['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxCrud['update']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxCrud['update']['outputSchema']>>('sandbox_update', args, Contract_7.sandboxCrud['update'].outputSchema),
            delete: (args: z.input<typeof Contract_7.sandboxCrud['delete']['inputSchema']>): Promise<z.infer<typeof Contract_7.sandboxCrud['delete']['outputSchema']>> => 
                this.request<z.infer<typeof Contract_7.sandboxCrud['delete']['outputSchema']>>('sandbox_delete', args, Contract_7.sandboxCrud['delete'].outputSchema),
        },
        settings: {
            get: (args: z.input<typeof Contract_8.settingsGetContract['inputSchema']>): Promise<z.infer<typeof Contract_8.settingsGetContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_8.settingsGetContract['outputSchema']>>('settings_get', args, Contract_8.settingsGetContract.outputSchema),
            update: (args: z.input<typeof Contract_8.settingsUpdateContract['inputSchema']>): Promise<z.infer<typeof Contract_8.settingsUpdateContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_8.settingsUpdateContract['outputSchema']>>('settings_update', args, Contract_8.settingsUpdateContract.outputSchema),
            getAll: (args: z.input<typeof Contract_8.settingsGetAllContract['inputSchema']>): Promise<z.infer<typeof Contract_8.settingsGetAllContract['outputSchema']>> => 
                this.request<z.infer<typeof Contract_8.settingsGetAllContract['outputSchema']>>('settings_getAll', args, Contract_8.settingsGetAllContract.outputSchema),
        },
    };
}
