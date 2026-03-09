import { Router } from 'express';
import { getStudents, getStudentById, createStudent, updateStudent, updateMyProgression } from './students.controller';
import { getStudentAnamnesis, createStudentAnamnesisResponse, updateStudentAnamnesisResponse } from '../anamnesis/anamnesis.controller';
import { authenticate, authorize } from '../../common/middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getStudents);
router.patch('/me/progression', updateMyProgression);
router.get('/:id', getStudentById);
router.post('/', authorize(['admin', 'school']), createStudent);
router.put('/:id', authorize(['admin', 'school']), updateStudent);

// Nested Anamnesis Routes
router.get('/:id/anamnesis', getStudentAnamnesis);
router.post('/:id/anamnesis/responses', createStudentAnamnesisResponse);
router.put('/:id/anamnesis/responses', updateStudentAnamnesisResponse);

import { getStudentActivityLogs } from '../activities/activities.controller';
router.get('/:id/activities', getStudentActivityLogs);

import { cognitiveProfileStudentRoutes } from '../cognitive-profiles/cognitive-profiles.routes';
router.use('/:id/cognitive-profile', cognitiveProfileStudentRoutes);

import { tutorRecommendationsStudentRoutes } from '../tutor-recommendations/tutor-recommendations.routes';
router.use('/:id', tutorRecommendationsStudentRoutes);

import { reportStudentRoutes } from '../reports/reports.routes';
router.use('/:id/reports', reportStudentRoutes);

import { checkinStudentRoutes } from '../checkins/checkins.routes';
router.use('/:id/checkins', checkinStudentRoutes);

export default router;
