import mongoose, { Schema, Document } from 'mongoose';

export interface IEsewaTransaction extends Document {
  student: mongoose.Types.ObjectId;
  feeRecord?: mongoose.Types.ObjectId;
  amount: number;
  transactionUuid: string;
  status: 'Pending' | 'Completed' | 'Failed';
  signature: string;
  organization: mongoose.Types.ObjectId;
  metadata?: any;
}

const esewaTransactionSchema = new Schema<IEsewaTransaction>({
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  feeRecord: { type: Schema.Types.ObjectId, ref: 'FeeRecord' },
  amount: { type: Number, required: true },
  transactionUuid: { type: String, required: true, unique: true },
  status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  signature: { type: String },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  metadata: { type: Schema.Types.Mixed }
}, { timestamps: true });

export default mongoose.model<IEsewaTransaction>('EsewaTransaction', esewaTransactionSchema);
