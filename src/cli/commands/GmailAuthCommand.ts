import { Command } from 'commander';
import { BaseCommand } from '../core/BaseCommand.js';
import { google } from 'googleapis';
import fs from 'fs/promises';
import readline from 'readline';
import { C } from '../core/Utils.js';

export class GmailAuthCommand extends BaseCommand {
    public readonly name = 'gmail-auth';
    public readonly description = 'Perform Gmail OAuth2 authentication flow';
    public readonly category = 'Setup';

    public register(program: Command): void {
        program
            .command(this.name)
            .description(this.description)
            .action(async () => {
                await this.execute();
            });
    }

    protected async execute(): Promise<void> {
        const credentialsPath = process.env.GMAIL_CREDENTIALS_PATH || '/home/ubuntu/Downloads/client_secret_876501583634-2i6cfc3s8i3nmf6t1uaet34pmsm53cd8.apps.googleusercontent.com.json';
        const tokenPath = process.env.GMAIL_TOKEN_PATH || './token.json';

        console.log(`${C.blue}Reading credentials from:${C.reset} ${credentialsPath}`);
        
        let credentials;
        try {
            const content = await fs.readFile(credentialsPath, 'utf-8');
            credentials = JSON.parse(content);
        } catch (err: unknown) {
            console.error(`${C.red}Error:${C.reset} Could not find client secret file at ${credentialsPath} - ${err instanceof Error ? err.message : String(err)}`);
            return;
        }

        const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/gmail.readonly',
                'https://www.googleapis.com/auth/gmail.send',
                'https://www.googleapis.com/auth/gmail.modify'
            ],
        });

        console.log(`\n${C.yellow}${C.bold}1. Authorize this app by visiting this url:${C.reset}\n${C.cyan}${authUrl}${C.reset}`);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        const input = await new Promise<string>((resolve) => {
            rl.question(`\n${C.yellow}${C.bold}2. Enter the code from that page here:${C.reset} `, (val) => {
                rl.close();
                resolve(val.trim());
            });
        });

        // Smart extraction: if they paste the whole URL, grab just the code param
        let code = input;
        if (input.includes('code=')) {
            try {
                const url = new URL(input);
                code = url.searchParams.get('code') || input;
            } catch {
                // Fallback to manual split if URL parsing fails
                const match = input.match(/[?&]code=([^&]+)/);
                if (match) code = match[1]!;
            }
        }

        try {
            const { tokens } = await oAuth2Client.getToken(code);
            await fs.writeFile(tokenPath, JSON.stringify(tokens, null, 2));
            console.log(`\n${C.green}${C.bold}✔ Successfully authenticated!${C.reset} Token saved to: ${tokenPath}`);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(`\n${C.red}${C.bold}✖ Error exchanging code:${C.reset} ${message}`);
        }
    }
}
