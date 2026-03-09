import { Router } from 'express';
import { getGuardians, updateGuardian, deleteGuardian } from './guardians.controller';

const router = Router();

router.get('/', getGuardians);
router.put('/:id', updateGuardian);
router.delete('/:id', deleteGuardian);

export default router;
