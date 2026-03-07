import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes';
import schoolRoutes from './modules/schools/schools.routes';
import tutorRoutes from './modules/tutors/tutors.routes';
import studentRoutes from './modules/students/students.routes';
import anamnesisRoutes from './modules/anamnesis/anamnesis.routes';
import activitiesRoutes from './modules/activities/activities.routes';
import reportsRoutes from './modules/reports/reports.routes';
import checkinRoutes from './modules/checkins/checkins.routes';
import bnccRoutes from './modules/bncc/bncc.routes';
import subjectsRoutes from './modules/subjects/subjects.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/schools', schoolRoutes);
router.use('/tutors', tutorRoutes);
router.use('/students', studentRoutes);
router.use('/anamnesis', anamnesisRoutes);
router.use('/activities', activitiesRoutes);
router.use('/reports', reportsRoutes);
router.use('/checkins', checkinRoutes);
router.use('/bncc', bnccRoutes);
router.use('/subjects', subjectsRoutes);

export default router;
