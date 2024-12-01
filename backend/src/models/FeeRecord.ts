import mongoose, { Schema, Document } from 'mongoose';

export interface IFeeRecord extends Document {
  student: mongoose.Types.ObjectId;
  description: string;
  amount: number;
  date: Date;
  status: 'Paid' | 'Pending' | 'Overdue';
  method: string;
  transactionId?: string;
  organization: mongoose.Types.ObjectId;
  branch: mongoose.Types.ObjectId;
}

const feeRecordSchema = new Schema<IFeeRecord>({
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
  method: { type: String, default: '-' },
  transactionId: { type: String },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true }
}, { timestamps: true });

export default mongoose.model<IFeeRecord>('FeeRecord', feeRecordSchema);
