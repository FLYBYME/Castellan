import { ISkillContext } from '@flybyme/castellan/core';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import {
    settingsGetContract,
    settingsUpdateContract,
    settingsGetAllContract
} from './settings.contract.js';

const configPath = path.resolve('./castellan.json');

/**
 * Enterprise-grade logger (leveraging context in real scenarios)
 */
function log(ctx: ISkillContext, level: 'info' | 'error' | 'warn', message: string, meta?: any) {
    console.log(`[${level.toUpperCase()}] [${ctx.correlationId}] [SettingsSkill] ${message}`, meta || '');
}

function loadConfig(ctx: ISkillContext): Record<string, any> {
    try {
        if (fs.existsSync(configPath)) {
            const content = fs.readFileSync(configPath, 'utf-8');
            return JSON.parse(content);
        }
        return {};
    } catch (err) {
        log(ctx, 'error', 'Failed to load configuration file', err);
        throw new Error('INTERNAL_SERVER_ERROR: Could not read configuration storage.');
    }
}

function saveConfig(ctx: ISkillContext, config: Record<string, any>) {
    try {
        const content = JSON.stringify(config, null, 2);
        fs.writeFileSync(configPath, content, 'utf-8');
    } catch (err) {
        log(ctx, 'error', 'Failed to save configuration file', err);
        throw new Error('INTERNAL_SERVER_ERROR: Could not write to configuration storage.');
    }
}

export async function settings_get(
    input: z.infer<typeof settingsGetContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof settingsGetContract.outputSchema>> {
    log(ctx, 'info', `Getting setting for key: ${input.key}`);
    const config = loadConfig(ctx);
    return config[input.key];
}

export async function settings_update(
    input: z.infer<typeof settingsUpdateContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof settingsUpdateContract.outputSchema>> {
    log(ctx, 'info', `Updating setting for key: ${input.key}`);
    const config = loadConfig(ctx);
    
    if (config[input.key] === input.value) {
        return { success: true };
    }

    config[input.key] = input.value;
    saveConfig(ctx, config);
    
    return { success: true };
}

export async function settings_get_all(
    _input: z.infer<typeof settingsGetAllContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof settingsGetAllContract.outputSchema>> {
    log(ctx, 'info', 'Getting all settings.');
    return loadConfig(ctx);
}
