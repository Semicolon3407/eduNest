import express from 'express';
import { getContacts, getMessages, sendMessage } from '../controllers/chatController';
import { protect } from '../middlewares/auth';

const router = express.Router();

router.use(protect);

router.get('/contacts', getContacts);
router.get('/messages/:recipientId', getMessages);
router.post('/messages', sendMessage);

export default router;
