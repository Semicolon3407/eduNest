import mongoose, { Schema, Document } from 'mongoose';

export interface ILibraryBook extends Document {
  title: string;
  author: string;
  isbn: string;
  shelf: string;
  totalCopies: number;
  availableCopies: number;
  organization: mongoose.Types.ObjectId;
  branch: mongoose.Types.ObjectId;
}

const libraryBookSchema = new Schema<ILibraryBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String },
  shelf: { type: String, required: true },
  totalCopies: { type: Number, default: 1 },
  availableCopies: { type: Number, default: 1 },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true }
}, { timestamps: true });

export default mongoose.model<ILibraryBook>('LibraryBook', libraryBookSchema);
