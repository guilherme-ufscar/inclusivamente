import { Router } from 'express';
import { getSchools, getSchoolById, createSchool, updateSchool, deleteSchool } from './schools.controller';
import { getClasses, createClass, updateClass, deleteClass } from './classes.controller';
import { getTutorsBySchool } from '../tutors/tutors.controller';
import { authenticate, authorize } from '../../common/middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getSchools);
router.get('/:id', getSchoolById);
router.get('/:id/tutors', getTutorsBySchool);
router.post('/', authorize(['admin']), createSchool);
router.put('/:id', authorize(['admin', 'school']), updateSchool);
router.delete('/:id', authorize(['admin']), deleteSchool);

export default router;
