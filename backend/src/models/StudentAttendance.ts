import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentAttendance extends Document {
  student: mongoose.Types.ObjectId;
  class: mongoose.Types.ObjectId;
  organization: mongoose.Types.ObjectId;
  branch: mongoose.Types.ObjectId;
  date: Date;
  status: 'Present' | 'Absent' | 'Late';
  markedBy: mongoose.Types.ObjectId; // Staff ID (Tutor)
  note?: string;
}

const studentAttendanceSchema = new Schema<IStudentAttendance>({
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  class: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Absent', 'Late'], default: 'Present' },
  markedBy: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
  note: { type: String }
}, { timestamps: true });

// Ensure one attendance record per student per day
studentAttendanceSchema.index({ student: 1, date: 1 }, { unique: true });

export default mongoose.model<IStudentAttendance>('StudentAttendance', studentAttendanceSchema);
