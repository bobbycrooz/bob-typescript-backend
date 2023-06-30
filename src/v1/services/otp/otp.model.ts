import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      set: (value: string) => value.toLowerCase()
    },
    otp: {
      type: String,
      required: true
    },

    otpId: {
      type: String,
      required: true
    },

    valid: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)



// module.exports = mongoose.model('User', userSchema)
export default mongoose.model('Otp', otpSchema)
// export const User = mongoose.model('User', userSchema)
