import mongoose, { Schema, Document } from 'mongoose';

export interface IDocument extends Document {
  organization: mongoose.Types.ObjectId;
  staff: mongoose.Types.ObjectId;
  title: string;
  category: string;
  type: string;
  size: string;
  status: string;
  url: string;
  createdAt: Date;
}

const DocumentSchema: Schema = new Schema({
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  staff: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: String, required: true },
  status: { type: String, enum: ['Pending Verification', 'Verified & Active', 'Expired / Needs Renewal'], default: 'Pending Verification' },
  url: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IDocument>('StaffDocument', DocumentSchema);
