import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { IFileSystem, FileEntry } from './IFileSystem.js';

const execAsync = promisify(exec);

export class LocalFileSystem implements IFileSystem {
    public async readFile(filePath: string): Promise<string> {
        return await fs.readFile(filePath, 'utf-8');
    }

    public async writeFile(filePath: string, content: string): Promise<void> {
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, content, 'utf-8');
    }

    public async stat(filePath: string): Promise<FileEntry> {
        const stats = await fs.stat(filePath);
        return {
            name: path.basename(filePath),
            isDirectory: stats.isDirectory(),
            size: stats.size,
            lastModified: stats.mtime
        };
    }

    public async rm(filePath: string, options?: { recursive?: boolean; force?: boolean }): Promise<void> {
        await fs.rm(filePath, { recursive: options?.recursive, force: options?.force });
    }

    public async mkdir(filePath: string, options?: { recursive?: boolean }): Promise<void> {
        await fs.mkdir(filePath, { recursive: options?.recursive });
    }

    public async readdir(dirPath: string): Promise<FileEntry[]> {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        const results: FileEntry[] = [];

        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);
            try {
                const stats = await fs.stat(fullPath);
                results.push({
                    name: entry.name,
                    isDirectory: entry.isDirectory(),
                    size: stats.size,
                    lastModified: stats.mtime
                });
            } catch (e) {
                // Skip if unreadable
            }
        }
        return results;
    }

    public async rename(oldPath: string, newPath: string): Promise<void> {
        await fs.mkdir(path.dirname(newPath), { recursive: true });
        await fs.rename(oldPath, newPath);
    }

    public async access(filePath: string): Promise<void> {
        await fs.access(filePath);
    }

    public async execOnHost(command: string, cwd: string): Promise<{ stdout: string; stderr: string; exitCode: number }> {
        try {
            const { stdout, stderr } = await execAsync(command, { cwd });
            return { stdout, stderr, exitCode: 0 };
        } catch (error: any) {
            return {
                stdout: error.stdout || '',
                stderr: error.stderr || error.message,
                exitCode: error.code || 1
            };
        }
    }
}
