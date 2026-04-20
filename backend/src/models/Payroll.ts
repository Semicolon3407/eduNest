import mongoose, { Schema, Document } from 'mongoose';

export interface IPayroll extends Document {
  staff: mongoose.Types.ObjectId;
  organization: mongoose.Types.ObjectId;
  month: string; // e.g., "October"
  year: number;
  baseSalary: number;
  bonuses: number;
  deductions: number;
  netPay: number;
  status: 'Pending' | 'Processed';
  paidAt?: Date;
}

const payrollSchema = new Schema({
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
  month: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  baseSalary: {
    type: Number,
    required: true
  },
  bonuses: {
    type: Number,
    default: 0
  },
  deductions: {
    type: Number,
    default: 0
  },
  netPay: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Processed'],
    default: 'Pending'
  },
  paidAt: Date
}, {
  timestamps: true
});

// Ensure a staff only has one payroll record per month/year
payrollSchema.index({ staff: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model<IPayroll>('Payroll', payrollSchema);
