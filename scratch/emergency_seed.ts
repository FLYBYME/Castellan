import { MongoClient } from 'mongodb';
import fs from 'fs/promises';
import path from 'path';

async function migrate() {
    const client = new MongoClient('mongodb://localhost:27017');
    try {
        await client.connect();
        const db = client.db('ask-castellan');
        const collection = db.collection('agents');
        const webCollection = db.collection('web');

        const modelsDir = path.resolve('./models');
        const files = await fs.readdir(modelsDir);
        const mdFiles = files.filter(f => f.endsWith('.md'));

        for (const file of mdFiles) {
            const content = await fs.readFile(path.join(modelsDir, file), 'utf-8');
            const parts = content.split('---');
            if (parts.length < 3) continue;

            const yaml = parts[1];
            const systemPrompt = parts.slice(2).join('---').trim();
            const metadata: Record<string, string> = {};
            yaml.split('\n').forEach(line => {
                const colonIdx = line.indexOf(':');
                if (colonIdx !== -1) {
                    const key = line.substring(0, colonIdx).trim();
                    const val = line.substring(colonIdx + 1).trim();
                    if (key) metadata[key] = val;
                }
            });

            const id = metadata.id || file.replace('.md', '');
            console.log(`Updating agent: ${id}...`);

            await collection.updateOne(
                { id },
                {
                    $set: {
                        systemPrompt,
                        name: metadata.name || id,
                        model: metadata.model || process.env.OLLAMA_MODEL_MEDIUM || 'gemma4:e4b',
                        updatedAt: new Date()
                    }
                },
                { upsert: true }
            );
        }

        // --- SEED WEB FEEDS ---
        console.log("Seeding default web feeds...");
        const defaultFeeds = [
            {
                id: 'weather.toronto',
                name: 'Toronto Weather',
                url: 'https://weather.gc.ca/rss/city/on-143_e.xml',
                extractionPrompt: 'Extract the current temperature, conditions, and any active weather warnings.',
                updatedAt: new Date()
            },
            {
                id: 'ttc.alerts',
                name: 'TTC Service Alerts',
                url: 'http://www.ttc.ca/RSS/Service_Alerts/index.rss',
                extractionPrompt: 'List any active subway or streetcar delays and their estimated impact.',
                updatedAt: new Date()
            }
        ];

        for (const feed of defaultFeeds) {
            await webCollection.updateOne(
                { id: feed.id },
                { $set: feed },
                { upsert: true }
            );
        }

        console.log('Migration complete.');
    } finally {
        await client.close();
    }
}

migrate().catch(console.error);
