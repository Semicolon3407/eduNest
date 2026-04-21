import mongoose, { Schema, Document } from 'mongoose';

export interface IClass extends Document {
  name: string; // e.g., Grade 10
  section: string; // e.g., A
  room: string;
  strength: number;
  tutor: string; // This could be ref to Staff later, but for now string as per UI
  capacity: number;
  branch: mongoose.Types.ObjectId;
  organization: mongoose.Types.ObjectId;
  status: 'Active' | 'Inactive';
}

const classSchema = new Schema<IClass>({
  name: { type: String, required: true },
  section: { type: String, required: true },
  room: { type: String, required: true },
  strength: { type: Number, default: 0 },
  tutor: { type: String, required: true },
  capacity: { type: Number, required: true },
  branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

classSchema.index({ organization: 1, branch: 1, name: 1, section: 1 }, { unique: true });

export default mongoose.model<IClass>('Class', classSchema);
