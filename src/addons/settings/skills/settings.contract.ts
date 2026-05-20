import { z } from 'zod';
import { defineContract } from 'castellan/core';
import { SettingGetInputSchema, SettingUpdateInputSchema } from './settings.schema.js';

export const settingsGetContract = defineContract({
    domain: 'settings',
    action: 'get',
    description: 'Get a configuration value',
    inputSchema: SettingGetInputSchema,
    outputSchema: z.any(),
    rest: { method: 'GET', path: '/settings/:key' }
});

export const settingsUpdateContract = defineContract({
    domain: 'settings',
    action: 'update',
    description: 'Update a configuration value',
    inputSchema: SettingUpdateInputSchema,
    outputSchema: z.object({
        success: z.boolean()
    }),
    rest: { method: 'POST', path: '/settings/update' }
});

export const settingsGetAllContract = defineContract({
    domain: 'settings',
    action: 'getAll',
    description: 'Get all configuration values',
    inputSchema: z.object({}),
    outputSchema: z.record(z.any()),
    rest: { method: 'GET', path: '/settings/all' }
});
