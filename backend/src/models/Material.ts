import mongoose, { Schema, Document } from 'mongoose';

export interface IMaterial extends Document {
  title: string;
  type: 'PDF' | 'Video' | 'Link' | 'Interactive' | 'Other';
  fileUrl?: string;
  externalLink?: string;
  fileSize?: string;
  class: mongoose.Types.ObjectId;
  organization: mongoose.Types.ObjectId;
  branch: mongoose.Types.ObjectId;
  uploadedBy: mongoose.Types.ObjectId; // Staff ID
  subject: string;
  date: Date;
}

const materialSchema = new Schema<IMaterial>({
  title: { type: String, required: true },
  type: { type: String, enum: ['PDF', 'Video', 'Link', 'Interactive', 'Other'], required: true },
  fileUrl: { type: String },
  externalLink: { type: String },
  fileSize: { type: String },
  class: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
  subject: { type: String, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model<IMaterial>('Material', materialSchema);
