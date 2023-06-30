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
    default: ['Pharmacy Pickup'],
    required: true
  },

  deliveryDetails: {
    address: String,
    phone: String
  }
})

export default mongoose.model('Prescription', PrescriptionSchema)
