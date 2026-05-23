import { CastellanClient } from '../src/generated/client/CastellanClient.js';

async function main() {
    const client = new CastellanClient('http://localhost:3000');
    console.log('Fetching all models...');
    const models = await client.api.models.find({});
    console.log(`Found ${models.length} models. Deleting...`);
    
    for (const model of models) {
        await client.api.models.delete({ id: model.id });
    }
    
    console.log('All models deleted.');
    client.close();
}

main().catch(console.error);
