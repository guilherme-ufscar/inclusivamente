import { Router } from 'express';
import { startActivity, finishActivity, submitTutorFeedback, getActivityLogById, getGlobalTutorHistory, getGameSessionDetails } from './activities.controller';
import { handleGamesWebhook } from './activities.webhook';
import { authenticate } from '../../common/middleware/auth';

const router = Router();

// Public Endpoints for Games (No JWT required)
router.post('/webhook', handleGamesWebhook);
router.get('/session/:log_id', getGameSessionDetails);

router.use(authenticate);

router.get('/history', getGlobalTutorHistory);
router.post('/start', startActivity);
router.post('/:id/finish', finishActivity);
router.post('/:id/tutor-feedback', submitTutorFeedback);
router.get('/:id', getActivityLogById);

export default router;
