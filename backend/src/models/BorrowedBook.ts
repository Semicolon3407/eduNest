import mongoose, { Schema, Document } from 'mongoose';

export interface IBorrowedBook extends Document {
  student: mongoose.Types.ObjectId;
  book: mongoose.Types.ObjectId;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'Active' | 'Returned' | 'Overdue';
  organization: mongoose.Types.ObjectId;
  branch: mongoose.Types.ObjectId;
}

const borrowedBookSchema = new Schema<IBorrowedBook>({
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  book: { type: Schema.Types.ObjectId, ref: 'LibraryBook', required: true },
  borrowDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date },
  status: { type: String, enum: ['Active', 'Returned', 'Overdue'], default: 'Active' },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true }
}, { timestamps: true });

export default mongoose.model<IBorrowedBook>('BorrowedBook', borrowedBookSchema);
