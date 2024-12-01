import mongoose, { Schema, Document } from 'mongoose';

export interface IExamRoutine extends Document {
  subject: string;
  date: Date;
  time: string;
  room: string;
  class: mongoose.Types.ObjectId;
  organization: mongoose.Types.ObjectId;
  branch: mongoose.Types.ObjectId;
}

const examRoutineSchema = new Schema<IExamRoutine>({
  subject: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  room: { type: String, required: true },
  class: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true }
}, { timestamps: true });

export default mongoose.model<IExamRoutine>('ExamRoutine', examRoutineSchema);
