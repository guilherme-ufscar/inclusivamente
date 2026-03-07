import { Router } from 'express';
import { getReports, getReportById, getStudentReports, generateStudentReport } from './reports.controller';
import { authenticate, authorize } from '../../common/middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/', getReports);
router.get('/:id', getReportById);

export const reportStudentRoutes = Router({ mergeParams: true });
reportStudentRoutes.use(authenticate);
reportStudentRoutes.get('/', getStudentReports);
reportStudentRoutes.post('/generate', authorize(['admin', 'school', 'tutor', 'teacher']), generateStudentReport);

export default router;
