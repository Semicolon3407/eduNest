import mongoose, { Schema } from 'mongoose';

const notificationSchema = new Schema({
  type: {
    type: String,
    enum: ['PLAN_EXPIRED', 'PLAN_EXPIRING_SOON', 'GENERAL'],
    default: 'GENERAL',
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    default: null,
  },
  recipient: {
    type: String,
    enum: ['SUPER_ADMIN', 'ORGANIZATION'],
    default: 'SUPER_ADMIN',
  },
  isRead: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Notification', notificationSchema);
