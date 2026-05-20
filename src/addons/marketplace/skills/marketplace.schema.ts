import { z } from 'zod';

export const AddonSchema = z.object({
    id: z.string().describe("The unique identifier for the addon"),
    name: z.string().describe("The human-readable name of the addon"),
    version: z.string().describe("The version string of the addon"),
    description: z.string().optional().describe("A brief description of what the addon does"),
    installed: z.boolean().describe("Whether the addon is currently installed")
});
export type Addon = z.infer<typeof AddonSchema>;

export const AddonInstallInputSchema = z.object({
    id: z.string().describe("The ID of the addon to install")
});
export type AddonInstallInput = z.infer<typeof AddonInstallInputSchema>;

export const AddonInstallOutputSchema = z.object({
    success: z.boolean().describe("Whether the installation was successful"),
    message: z.string().optional().describe("A response message from the installation process")
});
export type AddonInstallOutput = z.infer<typeof AddonInstallOutputSchema>;
