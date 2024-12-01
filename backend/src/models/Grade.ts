import mongoose, { Schema, Document } from 'mongoose';

export interface IGrade extends Document {
  student: mongoose.Types.ObjectId;
  class: mongoose.Types.ObjectId;
  organization: mongoose.Types.ObjectId;
  branch: mongoose.Types.ObjectId;
  term: string; // e.g., Midterm 2023
  subject: string;
  theoryMarks: number;
  practicalMarks: number;
  totalMarks: number;
  grade: string;
  maxTheory: number;
  maxPractical: number;
}

const gradeSchema = new Schema<IGrade>({
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  class: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
  term: { type: String, required: true },
  subject: { type: String, required: true },
  theoryMarks: { type: Number, required: true },
  practicalMarks: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  grade: { type: String, required: true },
  maxTheory: { type: Number, default: 75 },
  maxPractical: { type: Number, default: 25 }
}, { timestamps: true });

// Ensure unique record per student, per subject, per term
gradeSchema.index({ student: 1, term: 1, subject: 1 }, { unique: true });

export default mongoose.model<IGrade>('Grade', gradeSchema);
