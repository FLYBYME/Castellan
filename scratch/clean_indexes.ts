import { MongoClient } from 'mongodb';

async function main() {
    const client = new MongoClient('mongodb://localhost:27017');
    try {
        await client.connect();
        const db = client.db('ask-castellan');
        const collections = await db.listCollections().toArray();
        for (const colInfo of collections) {
            const name = colInfo.name;
            const collection = db.collection(name);
            console.log(`Checking indexes for collection: ${name}`);
            try {
                const indexes = await collection.indexes();
                console.log(`Indexes for ${name}:`, JSON.stringify(indexes));
                for (const idx of indexes) {
                    if (idx.name === 'id_1') {
                        console.log(`Dropping index id_1 on ${name}...`);
                        await collection.dropIndex('id_1');
                        console.log(`Successfully dropped index id_1 on ${name}`);
                    }
                }
            } catch (err) {
                console.error(`Error processing collection ${name}:`, err);
            }
        }
    } finally {
        await client.close();
    }
}

main().catch(console.error);
