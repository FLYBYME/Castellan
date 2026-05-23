import { threadCrud } from '../src/addons/infer/skills/infer.contract.js';
import { z } from 'zod';

type Output = z.infer<typeof threadCrud['create']['outputSchema']>;
const test: Output = {
    id: 'hello',
    status: 'active',
    model: 'test',
    createdAt: new Date(),
    updatedAt: new Date()
};
console.log('ID:', test.id);
