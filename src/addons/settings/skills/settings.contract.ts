import { z } from 'zod';
import { defineContract } from '@flybyme/castellan/core';
import { SettingGetInputSchema, SettingUpdateInputSchema } from './settings.schema.js';

export const settingsGetContract = defineContract({
    domain: 'settings',
    action: 'get',
    description: 'Get a configuration value',
    inputSchema: SettingGetInputSchema,
    outputSchema: z.any(),
    rest: { method: 'GET', path: '/settings/:key' },
    print: (output) => `**Setting Value**: ${typeof output === 'string' ? output : JSON.stringify(output, null, 2)}`
});

export const settingsUpdateContract = defineContract({
    domain: 'settings',
    action: 'update',
    description: 'Update a configuration value',
    inputSchema: SettingUpdateInputSchema,
    outputSchema: z.object({
        success: z.boolean()
    }),
    rest: { method: 'POST', path: '/settings/update' },
    print: (output) => output.success ? `✅ Setting updated successfully.` : `❌ Failed to update setting.`
});

export const settingsGetAllContract = defineContract({
    domain: 'settings',
    action: 'getAll',
    description: 'Get all configuration values',
    inputSchema: z.object({}),
    outputSchema: z.record(z.any()),
    rest: { method: 'GET', path: '/settings/all' },
    print: (output) => {
        const keys = Object.keys(output);
        if (keys.length === 0) return "No settings configured.";
        const rows = keys.map(k => `| ${k} | ${JSON.stringify(output[k])} |`).join('\n');
        return `
### Global Settings
| Key | Value |
| :--- | :--- |
${rows}
        `.trim();
    }
});
