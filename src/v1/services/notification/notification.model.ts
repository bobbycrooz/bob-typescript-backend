import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    messsage: {
      type: String,
      required: true
    },

    isRead: {
      type: Boolean,
      default: false
    },

    recipent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },

  {
    timestamps: true
  }
)

export default mongoose.model('Notification', notificationSchema)
