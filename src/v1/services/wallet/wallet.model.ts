import mongoose, { Schema, Document } from 'mongoose'

const WalletSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
  }, 
  balance: {
    value: {
      type: Number,
      default: 0,
      required: true
    },

    min: {
      type: Number,
      default: 100
    },

    interest: {
      type: Number,
      default: 20
    },

    currency: {
      type: String,
      default: 'NGN',
      
    }
  },

  name: {
    type: String,
    required: true,
    enum: ['savings', 'business', 'dom'],
    default: 'savings'
  },

  uuid: {
    type: String,
    required: false,
    default: ''
  }
})

export default mongoose.model('TestWallet', WalletSchema)
