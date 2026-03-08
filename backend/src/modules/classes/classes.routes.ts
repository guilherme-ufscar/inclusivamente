import { Router } from 'express';
import { getClasses, createClass, updateClass, deleteClass } from './classes.controller';
import { authenticate, authorize } from '../../common/middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getClasses);
router.post('/', authorize(['admin', 'school']), createClass);
router.put('/:id', authorize(['admin', 'school']), updateClass);
router.delete('/:id', authorize(['admin', 'school']), deleteClass);

export default router;
