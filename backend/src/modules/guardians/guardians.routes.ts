import { Router } from 'express';
// import { getGuardians, getGuardianById, createGuardian, updateGuardian } from './guardians.controller';
import { authenticate, authorize } from '../../common/middleware/auth';

const router = Router();

router.use(authenticate);

// router.get('/', authorize(['admin', 'school']), getGuardians);
// router.get('/:id', authorize(['admin', 'school']), getGuardianById);
// router.post('/', authorize(['admin', 'school']), createGuardian);
// router.put('/:id', authorize(['admin', 'school']), updateGuardian);

export default router;
