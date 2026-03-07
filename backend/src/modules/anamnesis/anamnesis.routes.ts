import { Router } from 'express';
import { getSpheres, createSphere, updateSphere, deleteSphere, getQuestions, createQuestion, updateQuestion, deleteQuestion } from './anamnesis.controller';
import { authenticate, authorize } from '../../common/middleware/auth';

const router = Router();

router.use(authenticate);

// Spheres
router.get('/spheres', getSpheres);
router.post('/spheres', authorize(['admin', 'school']), createSphere);
router.put('/spheres/:id', authorize(['admin', 'school']), updateSphere);
router.delete('/spheres/:id', authorize(['admin', 'school']), deleteSphere);

// Questions
router.get('/questions', getQuestions);
router.post('/questions', authorize(['admin', 'school']), createQuestion);
router.put('/questions/:id', authorize(['admin', 'school']), updateQuestion);
router.delete('/questions/:id', authorize(['admin', 'school']), deleteQuestion);

export default router;
