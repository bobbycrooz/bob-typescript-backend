import { string } from 'joi'
import mongoose from 'mongoose'

const subscriptionSchema = new mongoose.Schema(
  {
    subscriptionDuration: {
      type: String,
      enum: ['FREE', 'BiAnnual', 'Annual']
    },

    subscriptionType: {
      type: String,
      required: true,
      enum: ['Free', 'Prenium', "Classic"],
      default: 'Free'
    },

    subscriberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },

  {
    timestamps: true
  }
)

export default mongoose.model('Subscription', subscriptionSchema);