import { Router } from 'express';
import { getGuardianDashboard, getGuardianReports } from './guardians.controller';
import { authenticate, authorize } from '../../common/middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/me/dashboard', authorize(['parent']), getGuardianDashboard);
router.get('/me/reports', authorize(['parent']), getGuardianReports);

export default router;
