import { z } from 'zod';

export const SettingSchema = z.object({
    id: z.string().describe("The unique setting key"),
    value: z.any().describe("The setting value"),
    updatedAt: z.coerce.date().optional()
});
export type Setting = z.infer<typeof SettingSchema>;

export const SettingUpdateInputSchema = z.object({
    key: z.string().describe("The configuration key to update"),
    value: z.any().describe("The new value")
});
export type SettingUpdateInput = z.infer<typeof SettingUpdateInputSchema>;

export const SettingGetInputSchema = z.object({
    key: z.string().describe("The configuration key to retrieve")
});
export type SettingGetInput = z.infer<typeof SettingGetInputSchema>;
