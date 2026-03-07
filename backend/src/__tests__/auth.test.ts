import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const uniqueEmail = `test_auth_${Date.now()}@test.com`;
let token = '';

describe('Authentication API', () => {

    afterAll(async () => {
        // Teardown
        await prisma.user.deleteMany({ where: { email: uniqueEmail } });
        await prisma.$disconnect();
    });

    it('should register a new user successfully (as tutor)', async () => {
        // Assuming there is a master school, let's just fetch the first one for ID
        const school = await prisma.school.findFirst();

        const response = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test Tutor',
                email: uniqueEmail,
                password: 'password123',
                role: 'tutor', // Can be created via register since we didn't block role creation logic deeply for tests.
                school_id: school?.id
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('token');
    });

    it('should login an existing user', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: uniqueEmail,
                password: 'password123'
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('token');
        token = response.body.data.token;
    });

    it('should get current user profile using JWT', async () => {
        const response = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.user.email).toBe(uniqueEmail);
    });
});
