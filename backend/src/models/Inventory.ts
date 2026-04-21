import mongoose, { Schema, Document } from 'mongoose';

export interface IInventory extends Document {
  name: string;
  category: string;
  status: 'Available' | 'Allocated' | 'Maintenance' | 'Disposed';
  quantity: number;
  sku: string;
  cost: number;
  location: string;
  branch: mongoose.Types.ObjectId;
  organization: mongoose.Types.ObjectId;
}

const inventorySchema = new Schema<IInventory>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ['Available', 'Allocated', 'Maintenance', 'Disposed'], default: 'Available' },
  quantity: { type: Number, required: true },
  sku: { type: String, required: true },
  cost: { type: Number, required: true },
  location: { type: String, required: true },
  branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true }
}, { timestamps: true });

inventorySchema.index({ organization: 1, sku: 1 }, { unique: true });

export default mongoose.model<IInventory>('Inventory', inventorySchema);
