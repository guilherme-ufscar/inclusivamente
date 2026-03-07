import { Router } from 'express';
import { getCognitiveProfile, recalculateCognitiveProfile } from './cognitive-profiles.controller';
import { authenticate, authorize } from '../../common/middleware/auth';

const router = Router();

router.use(authenticate);

// Since these act on a student, they can be mounted under /api/students/:id/cognitive-profile
// To make it standalone we can do /api/cognitive-profiles/student/:id or similar.
// The spec says GET /api/students/:id/cognitive-profile. So we export routes to patch into students.routes.ts.

export const cognitiveProfileStudentRoutes = Router({ mergeParams: true });
cognitiveProfileStudentRoutes.get('/', getCognitiveProfile);
cognitiveProfileStudentRoutes.post('/recalculate', authorize(['admin', 'school', 'tutor', 'teacher']), recalculateCognitiveProfile);

export default router;
