import mongoose, { Schema, Document } from 'mongoose';

export interface IFee extends Document {
  organization: mongoose.Types.ObjectId;
  name: string;
  amount: number;
  frequency: 'Annual' | 'Termly' | 'Monthly' | 'One-time';
  category: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const feeSchema = new Schema<IFee>({
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  frequency: { 
    type: String, 
    enum: ['Annual', 'Termly', 'Monthly', 'One-time'], 
    required: true,
    default: 'Annual'
  },
  category: { type: String, required: true, default: 'Academic' },
  description: { type: String }
}, { timestamps: true });

export default mongoose.model<IFee>('Fee', feeSchema);
