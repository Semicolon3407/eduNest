import express from 'express';
import { protect, authorize } from '../middlewares/auth';
import { initiateEsewaPayment, verifyEsewaPayment, checkEsewaStatus } from '../controllers/paymentController';

const router = express.Router();

router.post('/esewa/initiate', protect, authorize('STUDENT'), initiateEsewaPayment);
router.get('/esewa/verify', protect, verifyEsewaPayment);
router.get('/esewa/status', protect, checkEsewaStatus);

export default router;
