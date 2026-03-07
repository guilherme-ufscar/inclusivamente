import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
let adminToken = '';
let studentId = '';
let tutorId = '';

describe('Activities and Logs API', () => {

    beforeAll(async () => {
        // Setup Admin, Student and Tutor
        const adminEmail = `admin_test_act_${Date.now()}@test.com`;
        const school = await prisma.school.findFirst();
        const student = await prisma.student.create({
            data: {
                name: 'Test Student For Activities',
                birth_date: new Date(),
                school_id: school?.id as string,
                grade_level: 'Teste'
            }
        });

        studentId = student.id;

        const tutor = await prisma.tutor.create({
            data: {
                name: 'Test Tutor Activities',
                email: `tutor_act_${Date.now()}@test.com`,
                school_id: school?.id as string,
                specialty: 'Geral'
            }
        });

        tutorId = tutor.id;

        const password_hash = await bcrypt.hash('password123', 10);
        const admin = await prisma.user.create({
            data: {
                name: 'Admin Test Act',
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
        await prisma.tutor.delete({ where: { id: tutorId } });
        await prisma.student.delete({ where: { id: studentId } });
        await prisma.user.deleteMany({ where: { email: { contains: 'admin_test_act_' } } });
        await prisma.$disconnect();
    });

    let logId = '';

    it('should start an activity without a tutor', async () => {
        const response = await request(app)
            .post('/api/activities/start')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                student_id: studentId,
                activity_id: 'game-abc-123',
                has_tutor: false
            });

        expect(response.status).toBe(201);
        expect(response.body.data.has_tutor).toBe(false);
    });

    it('should start an activity with a tutor', async () => {
        const response = await request(app)
            .post('/api/activities/start')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                student_id: studentId,
                activity_id: 'game-xyz-999',
                has_tutor: true,
                tutor_id: tutorId
            });

        expect(response.status).toBe(201);
        expect(response.body.data.has_tutor).toBe(true);
        expect(response.body.data.tutor_id).toBe(tutorId);

        logId = response.body.data.id;
    });

    it('should submit tutor feedback for a completed activity log', async () => {
        // End the activity first
        await request(app)
            .post(`/api/activities/${logId}/finish`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ time_spent: 120, errors_count: 2, correct_count: 10, difficulty_perceived: 'easy' });

        // Tutor submits feedback
        const response = await request(app)
            .post(`/api/activities/${logId}/tutor-feedback`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                autonomy_level: 'high',
                tutor_intervention_needed: 'no',
                tutor_observations: 'Student performed very well alone.'
            });

        expect(response.status).toBe(200);
        expect(response.body.data.autonomy_level).toBe('high');
        expect(response.body.data.tutor_observations).toContain('very well alone');
    });

});
