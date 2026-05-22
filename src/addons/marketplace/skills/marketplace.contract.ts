import { z } from 'zod';
import { defineContract } from 'castellan/core';
import { AddonSchema, AddonInstallInputSchema, AddonInstallOutputSchema } from './marketplace.schema.js';

export const marketplaceListContract = defineContract({
    domain: 'marketplace',
    action: 'list',
    description: 'List available and installed addons',
    inputSchema: z.object({}),
    outputSchema: z.array(AddonSchema),
    rest: { method: 'GET', path: '/marketplace/list' },
    print: (output) => `Found ${output.length} addons in marketplace.`
});

export const marketplaceInstallContract = defineContract({
    domain: 'marketplace',
    action: 'install',
    description: 'Install an addon',
    inputSchema: AddonInstallInputSchema,
    outputSchema: AddonInstallOutputSchema,
    rest: { method: 'POST', path: '/marketplace/install' },
    print: (output) => output.success ? `Successfully installed addon: ${output.message || 'Success'}` : `Failed to install addon: ${output.message || 'Failure'}`
});
