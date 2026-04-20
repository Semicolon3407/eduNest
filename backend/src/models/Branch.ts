import mongoose, { Schema, Document } from 'mongoose';

export interface IBranch extends Document {
  name: string;
  code: string;
  type: 'Main Campus (Headquarters)' | 'Satellite Branch' | 'Vocational Wing';
  location: string;
  phone: string;
  email: string;
  organization: mongoose.Types.ObjectId;
  status: 'Active' | 'Pending' | 'Suspended';
}

const branchSchema = new Schema<IBranch>({
  name: { type: String, required: true },
  code: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['Main Campus (Headquarters)', 'Satellite Branch', 'Vocational Wing'] 
  },
  location: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  status: { type: String, enum: ['Active', 'Pending', 'Suspended'], default: 'Active' }
}, { timestamps: true });

// Ensure code is unique within an organization
branchSchema.index({ organization: 1, code: 1 }, { unique: true });

export default mongoose.model<IBranch>('Branch', branchSchema);
