import mongoose, { Schema, Document } from 'mongoose';

export interface IBehaviorLog extends Document {
  student: mongoose.Types.ObjectId;
  organization: mongoose.Types.ObjectId;
  branch: mongoose.Types.ObjectId;
  tutor: mongoose.Types.ObjectId;
  engagementMetric: 'Exceptional Participation' | 'Active & Focused' | 'Moderate Attention' | 'Requires Encouragement' | 'Distracted / Off-task' | 'Unresponsive';
  observation: string;
  date: Date;
}

const behaviorLogSchema = new Schema<IBehaviorLog>({
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
  tutor: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
  engagementMetric: { 
    type: String, 
    enum: [
      'Exceptional Participation', 
      'Active & Focused', 
      'Moderate Attention', 
      'Requires Encouragement', 
      'Distracted / Off-task', 
      'Unresponsive'
    ], 
    required: true 
  },
  observation: { type: String, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model<IBehaviorLog>('BehaviorLog', behaviorLogSchema);
