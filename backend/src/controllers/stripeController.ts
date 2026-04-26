import { Request, Response } from 'express';
import Stripe from 'stripe';
import { AuthRequest } from '../middlewares/auth';
import Organization from '../models/Organization';
import Subscription from '../models/Subscription';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_SECRET_KEY) {
  console.warn('WARNING: STRIPE_SECRET_KEY is not defined in .env file. Stripe integration will not work.');
} else {
  console.log('Stripe Key Loaded:', STRIPE_SECRET_KEY.substring(0, 10) + '...');
}

const stripe = new Stripe(STRIPE_SECRET_KEY || 'sk_test_placeholder');

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

/**
 * @desc    Create Stripe Checkout Session
 * @route   POST /api/v1/payments/stripe/create-session
 * @access  Private (Organization)
 */
export const createCheckoutSession = async (req: AuthRequest, res: Response) => {
  try {
    const { subscriptionId } = req.body;

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription plan not found' });
    }

    const orgId = req.user.organization;
    if (!orgId) {
      return res.status(400).json({ success: false, message: 'User is not associated with an organization' });
    }

    const org = await Organization.findById(orgId);
    if (!org) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${subscription.name} Plan`,
              description: `${subscription.duration} subscription for ${org.name}`,
            },
            unit_amount: subscription.price * 100, // Stripe expects amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${CLIENT_URL}/organization/profile?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/organization/profile?payment=cancel`,
      metadata: {
        organizationId: org._id.toString(),
        subscriptionId: subscription._id.toString(),
      },
    });

    res.status(200).json({ success: true, url: session.url });
  } catch (err: any) {
    console.error('Stripe Session Error Details:', {
      message: err.message,
      type: err.type,
      code: err.code
    });
    res.status(500).json({ 
      success: false, 
      message: err.message.includes('Invalid API Key') 
        ? 'Stripe Configuration Error: Please check your STRIPE_SECRET_KEY in .env' 
        : err.message 
    });
  }
};

/**
 * @desc    Create Stripe Payment Intent
 * @route   POST /api/v1/payments/stripe/create-intent
 * @access  Private (Organization)
 */
export const createPaymentIntent = async (req: AuthRequest, res: Response) => {
  try {
    const { subscriptionId } = req.body;

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription plan not found' });
    }

    const orgId = req.user.organization;
    if (!orgId) {
      return res.status(400).json({ success: false, message: 'User is not associated with an organization' });
    }

    const intent = await stripe.paymentIntents.create({
      amount: subscription.price * 100,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        organizationId: orgId.toString(),
        subscriptionId: subscription._id.toString(),
      },
    });

    res.status(200).json({ 
      success: true, 
      clientSecret: intent.client_secret,
      amount: subscription.price,
      subscriptionName: subscription.name
    });
  } catch (err: any) {
    console.error('Stripe Intent Error Details:', {
      message: err.message,
      type: err.type,
      code: err.code
    });
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Stripe Webhook Handler
 * @route   POST /api/v1/payments/stripe/webhook
 * @access  Public
 */
export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test'
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle checkout session completed (legacy/redirect flow)
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const organizationId = session.metadata?.organizationId;
    const subscriptionId = session.metadata?.subscriptionId;

    if (organizationId && subscriptionId) {
      await updateOrgSubscription(organizationId, subscriptionId);
    }
  }

  // Handle payment intent succeeded (Elements flow)
  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object as any;
    const organizationId = intent.metadata?.organizationId;
    const subscriptionId = intent.metadata?.subscriptionId;

    if (organizationId && subscriptionId) {
      await updateOrgSubscription(organizationId, subscriptionId);
    }
  }

  res.status(200).json({ received: true });
};

const updateOrgSubscription = async (organizationId: string, subscriptionId: string) => {
  try {
    await Organization.findByIdAndUpdate(organizationId, {
      subscription: subscriptionId
    });
    console.log(`Organization ${organizationId} subscription updated to ${subscriptionId}`);
  } catch (err) {
    console.error('Error updating organization subscription after webhook:', err);
  }
};
