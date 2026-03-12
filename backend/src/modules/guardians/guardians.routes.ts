import { Router } from 'express';
import { getGuardianDashboard, getGuardianReports, getGuardians, updateGuardian, deleteGuardian } from './guardians.controller';
import { authenticate, authorize } from '../../common/middleware/auth';

const router = Router();

router.use(authenticate);

// CRUD for admin and school
router.get('/', authorize(['admin', 'school']), getGuardians);
router.put('/:id', authorize(['admin', 'school']), updateGuardian);
router.delete('/:id', authorize(['admin', 'school']), deleteGuardian);

// Parent-facing endpoints
router.get('/me/dashboard', authorize(['parent']), getGuardianDashboard);
router.get('/me/reports', authorize(['parent']), getGuardianReports);

export default router;
