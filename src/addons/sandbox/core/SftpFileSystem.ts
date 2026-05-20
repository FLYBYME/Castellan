// @ts-ignore
import Client from 'ssh2-sftp-client';
import { Client as SshClient, ConnectConfig } from 'ssh2';
import path from 'path';
import { IFileSystem, FileEntry } from './IFileSystem.js';

export class SftpFileSystem implements IFileSystem {
    private sftp: Client;
    private ssh: SshClient;
    private config: ConnectConfig;
    private connected: boolean = false;

    constructor(config: ConnectConfig) {
        this.sftp = new Client();
        this.ssh = new SshClient();
        this.config = config;
    }

    private async ensureConnected() {
        if (this.connected) return;

        await this.sftp.connect(this.config);
        
        await new Promise<void>((resolve, reject) => {
            this.ssh.on('ready', resolve);
            this.ssh.on('error', reject);
            this.ssh.connect(this.config);
        });

        this.connected = true;
    }

    public async readFile(filePath: string): Promise<string> {
        await this.ensureConnected();
        const buffer = await this.sftp.get(filePath) as Buffer;
        return buffer.toString('utf-8');
    }

    public async writeFile(filePath: string, content: string): Promise<void> {
        await this.ensureConnected();
        const dir = path.dirname(filePath);
        if (!(await this.sftp.exists(dir))) {
            await this.sftp.mkdir(dir, true);
        }
        await this.sftp.put(Buffer.from(content, 'utf-8'), filePath);
    }

    public async stat(filePath: string): Promise<FileEntry> {
        await this.ensureConnected();
        const stats = await this.sftp.stat(filePath);
        return {
            name: path.basename(filePath),
            isDirectory: stats.isDirectory,
            size: stats.size,
            lastModified: new Date(stats.modifyTime)
        };
    }

    public async rm(filePath: string, options?: { recursive?: boolean; force?: boolean }): Promise<void> {
        await this.ensureConnected();
        if (options?.recursive) {
            await this.sftp.rmdir(filePath, true);
        } else {
            await this.sftp.delete(filePath);
        }
    }

    public async mkdir(filePath: string, options?: { recursive?: boolean }): Promise<void> {
        await this.ensureConnected();
        await this.sftp.mkdir(filePath, options?.recursive);
    }

    public async readdir(dirPath: string): Promise<FileEntry[]> {
        await this.ensureConnected();
        const list = await this.sftp.list(dirPath);
        return list.map((item: { name: string; type: string; size: number; modifyTime: number }) => ({
            name: item.name,
            isDirectory: item.type === 'd',
            size: item.size,
            lastModified: new Date(item.modifyTime)
        }));
    }

    public async rename(oldPath: string, newPath: string): Promise<void> {
        await this.ensureConnected();
        const destDir = path.dirname(newPath);
        if (!(await this.sftp.exists(destDir))) {
            await this.sftp.mkdir(destDir, true);
        }
        await this.sftp.rename(oldPath, newPath);
    }

    public async access(filePath: string): Promise<void> {
        await this.ensureConnected();
        const exists = await this.sftp.exists(filePath);
        if (!exists) throw new Error(`File does not exist: ${filePath}`);
    }

    public async execOnHost(command: string, cwd: string): Promise<{ stdout: string; stderr: string; exitCode: number }> {
        await this.ensureConnected();
        return new Promise((resolve, reject) => {
            // We use the SSH client to exec commands. 
            // We need to wrap it in a shell or cd into the directory first.
            const fullCommand = `cd ${cwd} && ${command}`;
            this.ssh.exec(fullCommand, (err, stream) => {
                if (err) return reject(err);
                
                let stdout = '';
                let stderr = '';
                stream.on('data', (data: Buffer) => {
                    stdout += data.toString();
                }).stderr.on('data', (data: Buffer) => {
                    stderr += data.toString();
                });
                
                stream.on('close', (code: number) => {
                    resolve({ stdout, stderr, exitCode: code });
                });
            });
        });
    }

    public async disconnect() {
        if (this.connected) {
            await this.sftp.end();
            this.ssh.end();
            this.connected = false;
        }
    }
}
