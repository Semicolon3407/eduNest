import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  user: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  studentEmail?: string;
  personalEmail?: string;
  admissionNumber: string;
  class: mongoose.Types.ObjectId;
  emergencyContact: string;
  branch: mongoose.Types.ObjectId;
  organization: mongoose.Types.ObjectId;
  dob: Date;
  status: 'Active' | 'Pending' | 'Rejected' | 'Inactive';
  academicYear: string;
  enrolledDate: Date;
}

const studentSchema = new Schema<IStudent>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  studentEmail: { type: String },
  personalEmail: { type: String },
  admissionNumber: { type: String, required: true },
  class: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  emergencyContact: { type: String, required: true },
  branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  dob: { type: Date, required: true },
  status: { type: String, enum: ['Active', 'Pending', 'Rejected', 'Inactive'], default: 'Active' },
  academicYear: { type: String, required: true },
  enrolledDate: { type: Date, default: Date.now }
}, { timestamps: true });

studentSchema.index({ organization: 1, admissionNumber: 1 }, { unique: true });

export default mongoose.model<IStudent>('Student', studentSchema);
