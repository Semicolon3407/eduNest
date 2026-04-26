import mongoose, { Schema, Document } from 'mongoose';

export interface ITicket extends Document {
  issue: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  organization: mongoose.Types.ObjectId;
  resolutionNotes?: string;
  replyMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<ITicket>(
  {
    issue: {
      type: String,
      required: [true, 'Please provide an issue title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide issue description'],
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open',
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    resolutionNotes: {
      type: String,
    },
    replyMessage: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITicket>('Ticket', ticketSchema);
