import 'dotenv/config';
import { MongoClient } from 'mongodb';

async function main() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("MONGODB_URI is not set in .env!");
        process.exit(1);
    }
    console.log("Connecting to:", uri);
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    try {
        await client.connect();
        console.log("Connected successfully!");
        const db = client.db('ask-castellan');
        console.log("Querying 'ollama' collection...");
        const docs = await db.collection('ollama').find({}).toArray();
        console.log("Documents in 'ollama':", docs);
    } catch (err) {
        console.error("Database connection error:", err);
    } finally {
        await client.close();
        console.log("Connection closed.");
    }
}

main();
