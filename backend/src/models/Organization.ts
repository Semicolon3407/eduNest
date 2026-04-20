import mongoose, { Schema } from 'mongoose';

const organizationSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please add an organization name'],
    unique: true,
  },
  type: {
    type: String,
    required: [true, 'Please add an organization type'],
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
  },
  branchCount: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    enum: ['Active', 'Pending', 'Suspended'],
    default: 'Pending',
  },
  subscriptionPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubscriptionPlan',
  },
  email: {
    type: String,
    required: [true, 'Please add a business email'],
    unique: true,
  },
  personalEmail: {
    type: String,
    required: [true, 'Please add a personal email'],
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
  },
}, {
  timestamps: true,
});

export default mongoose.model('Organization', organizationSchema);
