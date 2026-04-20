import mongoose, { Schema } from 'mongoose';

const subscriptionSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please add a subscription name'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  duration: {
    type: String,
    enum: ['Monthly', '3 Months', '6 Months', 'Annual'],
    required: [true, 'Please add a duration']
  },
  features: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

export default mongoose.model('Subscription', subscriptionSchema);
