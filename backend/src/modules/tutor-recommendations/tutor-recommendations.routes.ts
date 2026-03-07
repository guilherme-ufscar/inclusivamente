import { Router } from 'express';
import { getTutorRecommendation, getTutorHistory } from './tutor-recommendations.controller';
import { authenticate } from '../../common/middleware/auth';

export const tutorRecommendationsStudentRoutes = Router({ mergeParams: true });
tutorRecommendationsStudentRoutes.use(authenticate);

tutorRecommendationsStudentRoutes.get('/tutor-recommendation', getTutorRecommendation);
tutorRecommendationsStudentRoutes.get('/tutor-history', getTutorHistory);
