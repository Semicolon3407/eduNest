import mongoose, { Schema } from 'mongoose';

const subscriptionPlanSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please add a plan name'],
    unique: true,
  },
  monthlyPrice: {
    type: Number,
    required: [true, 'Please add a monthly price'],
  },
  yearlyPrice: {
    type: Number,
    required: [true, 'Please add a yearly price'],
  },
  features: [
    {
      type: String,
    }
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
