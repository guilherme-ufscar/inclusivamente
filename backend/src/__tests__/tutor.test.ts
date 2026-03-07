import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
let adminToken = '';
let studentId = '';

describe('Tutor Recommendation Motor API', () => {

    beforeAll(async () => {
        // Setup Admin
        const adminEmail = `admin_test_tutor_${Date.now()}@test.com`;
        const school = await prisma.school.findFirst();
        const student = await prisma.student.create({
            data: {
                name: 'Test Student For Tutor',
                birth_date: new Date(),
                school_id: school?.id as string,
                grade_level: 'Teste'
            }
        });

        studentId = student.id;

        // We can also create an admin
        const password_hash = await bcrypt.hash('password123', 10);
        const admin = await prisma.user.create({
            data: {
                name: 'Admin Test',
                email: adminEmail,
                password_hash,
                role: 'admin',
                school_id: school?.id
            }
        });

        const loginRes = await request(app).post('/api/auth/login').send({ email: adminEmail, password: 'password123' });
        adminToken = loginRes.body.data.token;
    });

    afterAll(async () => {
        // Teardown
        await prisma.activityLog.deleteMany({ where: { student_id: studentId } });
        await prisma.student.delete({ where: { id: studentId } });
        await prisma.user.deleteMany({ where: { email: { contains: 'admin_test_tutor_' } } });
        await prisma.$disconnect();
    });

    it('should return insufficient sampling for < 3 activities', async () => {
        const response = await request(app)
            .get(`/api/students/${studentId}/tutor-recommendation`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data.recommendation).toBeNull();
        expect(response.body.data.status).toBe('neutral');
    });

    it('should recommend continuous tutor when percentage > 70 and avg autonomy low', async () => {

        // Create 3 activities with low autonomy
        await prisma.activityLog.createMany({
            data: [1, 2, 3].map(i => ({
                student_id: studentId,
                activity_id: `test-act-${i}`,
                has_tutor: true,
                started_at: new Date(),
                completed_at: new Date(),
                autonomy_level: 'low',
                tutor_intervention_needed: 'yes'
            }))
        });

        const response = await request(app)
            .get(`/api/students/${studentId}/tutor-recommendation`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data.recommendation).toBe('continuous');
    });

});
