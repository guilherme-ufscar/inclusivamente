import { Router } from 'express';
import { getSubjects, createSubject, updateSubject, deleteSubject, getChapters, createChapter, updateChapter, deleteChapter } from './subjects.controller';
import { authenticate, authorize } from '../../common/middleware/auth';

const router = Router();

router.use(authenticate);

// Subjects
router.get('/', getSubjects);
router.post('/', authorize(['admin']), createSubject);
router.put('/:id', authorize(['admin']), updateSubject);
router.delete('/:id', authorize(['admin']), deleteSubject);

// Chapters
router.get('/chapters', getChapters);
router.post('/chapters', authorize(['admin']), createChapter);
router.put('/chapters/:id', authorize(['admin']), updateChapter);
router.delete('/chapters/:id', authorize(['admin']), deleteChapter);

export default router;
