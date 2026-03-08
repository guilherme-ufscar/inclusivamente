import { Router } from 'express';
import {
    getSpheres, createSphere, updateSphere, deleteSphere,
    getQuestions, createQuestion, updateQuestion, deleteQuestion,
    getKinship, createKinship, updateKinship, deleteKinship
} from './anamnesis.controller';
import { authenticate, authorize } from '../../common/middleware/auth';

const router = Router();

router.use(authenticate);

// Kinship
router.get('/kinship', getKinship);
router.post('/kinship', authorize(['admin', 'school']), createKinship);
router.put('/kinship/:id', authorize(['admin', 'school']), updateKinship);
router.delete('/kinship/:id', authorize(['admin', 'school']), deleteKinship);

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
