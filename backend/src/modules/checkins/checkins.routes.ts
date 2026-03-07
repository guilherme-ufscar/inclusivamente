import { Router } from 'express';
import { sendFamilyCheckins, getStudentCheckins } from './checkins.controller';
import { authenticate, authorize } from '../../common/middleware/auth';

const router = Router();
router.use(authenticate);

// Main route
router.post('/send', authorize(['admin', 'school', 'tutor', 'teacher']), sendFamilyCheckins);

// Nested resource
export const checkinStudentRoutes = Router({ mergeParams: true });
checkinStudentRoutes.use(authenticate);
checkinStudentRoutes.get('/', getStudentCheckins);

export default router;
