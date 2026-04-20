import mongoose, { Schema, Document } from 'mongoose';

export interface IStaff extends Document {
  user: mongoose.Types.ObjectId;
  organization: mongoose.Types.ObjectId;
  branch: mongoose.Types.ObjectId;
  employeeId: string;
  department: string;
  firstName: string;
  lastName: string;
  personalEmail?: string;
  phone?: string;
  status: 'Active' | 'Pending' | 'Inactive';
}

const staffSchema = new Schema<IStaff>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
  employeeId: { type: String, required: true },
  department: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  personalEmail: { type: String },
  phone: { type: String },
  status: { type: String, enum: ['Active', 'Pending', 'Inactive'], default: 'Active' }
}, { timestamps: true });

// Ensure employeeId is unique within an organization
staffSchema.index({ organization: 1, employeeId: 1 }, { unique: true });

export default mongoose.model<IStaff>('Staff', staffSchema);
