import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission extends Document {
  assignment: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  organization: mongoose.Types.ObjectId;
  branch: mongoose.Types.ObjectId;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  submittedAt: Date;
  status: 'Submitted' | 'Graded' | 'Late';
  grade?: string;
  feedback?: string;
  remarks?: string;
}

const submissionSchema = new Schema<ISubmission>({
  assignment: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
  fileUrl: { type: String, required: true },
  fileName: { type: String, required: true },
  fileSize: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['Submitted', 'Graded', 'Late'], default: 'Submitted' },
  grade: { type: String },
  feedback: { type: String },
  remarks: { type: String }
}, { timestamps: true });

export default mongoose.model<ISubmission>('Submission', submissionSchema);
