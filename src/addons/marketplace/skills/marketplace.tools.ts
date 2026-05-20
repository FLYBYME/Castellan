import { ISkillContext } from 'castellan/core';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import {
    marketplaceListContract,
    marketplaceInstallContract
} from './marketplace.contract.js';

const addonsDir = path.resolve('./src/addons');

function log(ctx: ISkillContext, level: 'info' | 'error' | 'warn', message: string, meta?: any) {
    console.log(`[${level.toUpperCase()}] [${ctx.correlationId}] [MarketplaceSkill] ${message}`, meta || '');
}

export async function marketplace_list(
    _input: z.infer<typeof marketplaceListContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof marketplaceListContract.outputSchema>> {
    log(ctx, 'info', 'Listing addons...');
    try {
        if (!fs.existsSync(addonsDir)) {
            return [];
        }

        const addonNames = fs.readdirSync(addonsDir).filter(name => {
            const fullPath = path.join(addonsDir, name);
            return fs.statSync(fullPath).isDirectory();
        });

        return addonNames.map(name => ({
            id: name,
            name: name.charAt(0).toUpperCase() + name.slice(1),
            version: '1.0.0',
            description: `Modular extension: ${name}`,
            installed: true
        }));
    } catch (err) {
        log(ctx, 'error', 'Failed to list addons', err);
        throw new Error('INTERNAL_SERVER_ERROR: Could not scan addons directory.');
    }
}

export async function marketplace_install(
    input: z.infer<typeof marketplaceInstallContract.inputSchema>,
    ctx: ISkillContext
): Promise<z.infer<typeof marketplaceInstallContract.outputSchema>> {
    log(ctx, 'info', `Requested installation for addon: ${input.id}`);
    
    if (!input.id) {
        throw new Error('BAD_REQUEST: Addon ID is required.');
    }

    log(ctx, 'warn', `Installation for ${input.id} is not fully implemented.`);
    
    return { 
        success: false, 
        message: `Addon "${input.id}" installation failed: Remote repository unreachable in prototype mode.` 
    };
}
