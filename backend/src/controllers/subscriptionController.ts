import { Request, Response } from 'express';
import Subscription from '../models/Subscription';

// @desc    Get all subscriptions
// @route   GET /api/v1/super-admin/subscriptions
// @access  Private/SuperAdmin
export const getSubscriptions = async (req: Request, res: Response) => {
  try {
    const subscriptions = await Subscription.find();
    res.status(200).json({ success: true, count: subscriptions.length, data: subscriptions });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Create a subscription
// @route   POST /api/v1/super-admin/subscriptions
// @access  Private/SuperAdmin
export const createSubscription = async (req: Request, res: Response) => {
  try {
    const subscription = await Subscription.create(req.body);
    res.status(201).json({ success: true, data: subscription });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update a subscription
// @route   PUT /api/v1/super-admin/subscriptions/:id
// @access  Private/SuperAdmin
export const updateSubscription = async (req: Request, res: Response) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    res.status(200).json({ success: true, data: subscription });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete a subscription
// @route   DELETE /api/v1/super-admin/subscriptions/:id
// @access  Private/SuperAdmin
export const deleteSubscription = async (req: Request, res: Response) => {
  try {
    const subscription = await Subscription.findByIdAndDelete(req.params.id);

    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
