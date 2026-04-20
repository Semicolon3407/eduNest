import mongoose, { Schema, Document } from 'mongoose';

export interface ILeave extends Document {
  staff: mongoose.Types.ObjectId;
  organization: mongoose.Types.ObjectId;
  type: 'Sick' | 'Annual' | 'Casual' | 'Maternity' | 'Paternity';
  startDate: Date;
  endDate: Date;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: Date;
  approvedBy?: mongoose.Types.ObjectId;
}

const leaveSchema = new Schema({
  staff: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  type: {
    type: String,
    enum: ['Sick', 'Annual', 'Casual', 'Maternity', 'Paternity'],
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
