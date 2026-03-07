import { Router } from 'express';
import { getTutors, getTutorById, createTutor, updateTutor, deleteTutor, getTutorsBySchool } from './tutors.controller';
import { authenticate, authorize } from '../../common/middleware/auth';

const router = Router();

router.use(authenticate);

// We define school-based route externally or handle it through query params. Here it's generic /api/tutors
router.get('/', getTutors);
router.get('/school/:id', getTutorsBySchool);
router.get('/:id', getTutorById);
router.post('/', authorize(['admin', 'school']), createTutor);
router.put('/:id', authorize(['admin', 'school']), updateTutor);
router.delete('/:id', authorize(['admin', 'school']), deleteTutor);

export default router;
