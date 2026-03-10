import { Router } from 'express';
import { syncInventory, getInventory } from './inventory.controller';

const router = Router();

// Public Endpoints for Games (No JWT required)
router.post('/sync', syncInventory);
router.get('/:student_id', getInventory);

export default router;
