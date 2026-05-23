
import { allSkills } from '../src/skills/index.js';
import { z } from 'zod';

async function testRegistry() {
    console.log("Inspecting Skills and Contracts...");
    for (const skill of allSkills) {
        console.log(`\nSkill Domain: ${skill.domain}`);
        const contracts = skill.getContracts();
        for (const contract of contracts) {
            console.log(`  - Action: ${contract.action} (Domain: ${contract.domain})`);
        }
    }
}

testRegistry().catch(console.error);
