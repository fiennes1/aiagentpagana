import { Router } from 'express';
import * as messageController from '../controllers/messageController.js';

const router = Router();

router.post('/messages', messageController.sendMessage);
router.get('/messages', messageController.getMessages);

export default router;

