import { Stats } from 'fs';

export interface FileEntry {
    name: string;
    isDirectory: boolean;
    size: number;
    lastModified?: Date;
}

export interface IFileSystem {
    readFile(path: string): Promise<string>;
    writeFile(path: string, content: string): Promise<void>;
    stat(path: string): Promise<FileEntry>;
    rm(path: string, options?: { recursive?: boolean; force?: boolean }): Promise<void>;
    mkdir(path: string, options?: { recursive?: boolean }): Promise<void>;
    readdir(path: string): Promise<FileEntry[]>;
    rename(oldPath: string, newPath: string): Promise<void>;
    access(path: string): Promise<void>;
    execOnHost(command: string, cwd: string): Promise<{ stdout: string; stderr: string; exitCode: number }>;
}
