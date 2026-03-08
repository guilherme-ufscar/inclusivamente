import { Router } from 'express';
import { startActivity, finishActivity, submitTutorFeedback, getActivityLogById, getGlobalTutorHistory } from './activities.controller';
import { handleGamesWebhook } from './activities.webhook';
import { authenticate } from '../../common/middleware/auth';

const router = Router();

// Public Webhook (No JWT required)
router.post('/webhook', handleGamesWebhook);

router.use(authenticate);

router.get('/history', getGlobalTutorHistory);
router.post('/start', startActivity);
router.post('/:id/finish', finishActivity);
router.post('/:id/tutor-feedback', submitTutorFeedback);
router.get('/:id', getActivityLogById);

export default router;
