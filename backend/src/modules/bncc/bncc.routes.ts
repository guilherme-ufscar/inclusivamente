import { Router } from 'express';
import { getBncc, createBncc, updateBncc, deleteBncc } from './bncc.controller';
import { authenticate, authorize } from '../../common/middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/', getBncc);
router.post('/', authorize(['admin', 'school']), createBncc);
router.put('/:id', authorize(['admin', 'school']), updateBncc);
router.delete('/:id', authorize(['admin', 'school']), deleteBncc);

export default router;
