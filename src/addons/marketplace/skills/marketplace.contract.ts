import { z } from 'zod';
import { defineContract } from '@flybyme/castellan/core';
import { AddonSchema, AddonInstallInputSchema, AddonInstallOutputSchema } from './marketplace.schema.js';

export const marketplaceListContract = defineContract({
    domain: 'marketplace',
    action: 'list',
    description: 'List available and installed addons',
    inputSchema: z.object({}),
    outputSchema: z.array(AddonSchema),
    rest: { method: 'GET', path: '/marketplace/list' },
    print: (output) => {
        if (output.length === 0) return "No addons found in the marketplace.";
        const rows = output.map(a => `| ${a.name} | ${a.installed ? '✅ Yes' : '❌ No'} | ${a.description || 'No description'} |`).join('\n');
        return `
### Marketplace Addons
| Name | Installed | Description |
| :--- | :--- | :--- |
${rows}
        `.trim();
    }
});

export const marketplaceInstallContract = defineContract({
    domain: 'marketplace',
    action: 'install',
    description: 'Install an addon',
    inputSchema: AddonInstallInputSchema,
    outputSchema: AddonInstallOutputSchema,
    rest: { method: 'POST', path: '/marketplace/install' },
    print: (output) => output.success ? `✅ **Successfully installed addon**: ${output.message || 'Complete'}` : `❌ **Failed to install addon**: ${output.message || 'Unknown error'}`
});
