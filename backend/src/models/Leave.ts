import mongoose, { Schema, Document } from 'mongoose';

export interface ILeave extends Document {
  user: mongoose.Types.ObjectId;
  staff?: mongoose.Types.ObjectId;
  student?: mongoose.Types.ObjectId;
  organization: mongoose.Types.ObjectId;
  branch?: mongoose.Types.ObjectId;
  type: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: Date;
  approvedBy?: mongoose.Types.ObjectId;
}

const leaveSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  staff: {
    type: Schema.Types.ObjectId,
    ref: 'Staff'
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  branch: {
    type: Schema.Types.ObjectId,
    ref: 'Branch'
  },
  type: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

export default mongoose.model<ILeave>('Leave', leaveSchema);
