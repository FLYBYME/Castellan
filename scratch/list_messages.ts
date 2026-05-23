
import { allSkills } from '../src/skills/index.js';
import { SkillRegistry } from '../src/server/core/SkillRegistry.js';
import { CastellanDaemon } from '../src/server/core/CastellanDaemon.js';
import { MessageSchema } from '../src/skills/agents/agent.schema.js';

async function listMessages() {
    // This is a bit hacky because we need a running daemon or at least the DB
    // But we can try to connect to the DB directly if we know the URL.
    // Usually it's in .env
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/castellan');
    await client.connect();
    const db = client.db();
    const messages = await db.collection('message').find({}).sort({ createdAt: -1 }).limit(10).toArray();
    console.log(JSON.stringify(messages, null, 2));
    await client.close();
}

listMessages().catch(console.error);
