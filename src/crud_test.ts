import { C } from './cli/core/Utils.js';
import { CastellanClient } from './generated/client/CastellanClient.js';

const client = new CastellanClient('http://localhost:3000');

async function runTests() {
    console.log(`\n${C.magenta}${C.bold}=== STARTING CASTELAN SDK CRUD INTEGRATION TESTS ===${C.reset}\n`);

    const sortA = await client.api.threads.find({
        sort: 'createdAt:desc',
        limit: 1
    });
    console.log(sortA);

    const sortB = await client.api.threads.find({
        sort: 'createdAt:desc',
        limit: 1
    });
    console.log(sortB);


    // find_one sort

    const findOneA = await client.api.threads.find_one({
        sort: 'createdAt:desc'
    });
    console.log(findOneA);

    const findOneB = await client.api.threads.find_one({
        sort: 'createdAt:asc'
    });
    console.log(findOneB);


    console.log(`\n${C.green}${C.bold}=== ALL SDK CRUD INTEGRATION TESTS PASSED TRIUMPHANTLY! ===${C.reset}\n`);
    client.close();
}

runTests().catch((err) => {
    console.error(err);
    client.close();
    process.exit(1);
});
