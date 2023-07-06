import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

const PrescriptionSchema = new mongoose.Schema({
  contact: {
    name: {
      type: String,
      required: true
    },
    phone: String,
    dob: String,
    address: String
  },

  allergies: {
    type: [String],
    required: true
  },

  medicalHistory: {
    type: [String],
    required: true
  },

  currentMedication: {
    type: [String],
    required: true
  },

  medications: [
    {
      name: String,

      quantity: String
    }
  ],
  complaints: {
    type: String,
    required: true
  },

  medicationImage: {
    type: String
  },

  phamacyInfo: {
    phamacyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Phamacy'
    }
  },

  deliveryMethod: {
    type: String,
    enum: ['Pharmacy Pickup', 'Home Delivery'],
    default: 'Pharmacy Pickup',
    required: true
  },

  status: {
    type: String,
    enum: ['approved', 'rejected', 'pending'],
    default: 'pending',
    required: true
  },

  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  deliveryDetails: {
    address: String,
    phone: String,
    stauts: {
      type: String,
      enum: ['pending', 'delivered', 'cancelled', 'packaged'],
      default: 'pending'
    }
  },

  prescribedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  prescribedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  underReview: {
    value: Boolean,
    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
})

export default mongoose.model('Prescription', PrescriptionSchema)
