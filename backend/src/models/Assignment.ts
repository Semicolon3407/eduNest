import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
  title: string;
  subject: string;
  class: mongoose.Types.ObjectId;
  tutor: mongoose.Types.ObjectId;
  organization: mongoose.Types.ObjectId;
  branch: mongoose.Types.ObjectId;
  dueDate: Date;
  instructions: string;
  attachments?: string[];
  status: 'Active' | 'Completed' | 'Archived';
}

const assignmentSchema = new Schema<IAssignment>({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  class: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  tutor: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
  dueDate: { type: Date, required: true },
  instructions: { type: String, required: true },
  attachments: [{ type: String }],
  status: { type: String, enum: ['Active', 'Completed', 'Archived'], default: 'Active' }
}, { timestamps: true });

export default mongoose.model<IAssignment>('Assignment', assignmentSchema);
