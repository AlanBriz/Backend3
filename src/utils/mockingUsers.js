import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

export async function generateMockUsers(count) {
    const users = [];

    for (let i = 0; i < count; i++) {
        const hashedPassword = await bcrypt.hash("coder123", 10);

        users.push({
            _id: faker.string.uuid(), // random id
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: hashedPassword,
            role: faker.helpers.arrayElement(["user","admin"]),
            pets: []
        });
    }

    return users;
}