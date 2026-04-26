import express from 'express';
import { protect, authorize } from '../middlewares/auth';
import { initiateEsewaPayment, verifyEsewaPayment, checkEsewaStatus } from '../controllers/paymentController';
import { createCheckoutSession, createPaymentIntent } from '../controllers/stripeController';

const router = express.Router();

router.post('/esewa/initiate', protect, authorize('STUDENT'), initiateEsewaPayment);
router.get('/esewa/verify', protect, verifyEsewaPayment);
router.get('/esewa/status', protect, checkEsewaStatus);

// Stripe Routes
router.post('/stripe/create-session', protect, createCheckoutSession);
router.post('/stripe/create-intent', protect, createPaymentIntent);

export default router;
