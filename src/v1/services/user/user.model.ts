import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    // required: true,
    set: (value: string) => value.toLowerCase()
  },

  phone: {
    type: String,
    required: true
  },

  password: {
    type: String,
    // required: true,
    set: (value: any) => {
      const hash = bcrypt.hashSync(value, 8)
      return hash
    }
  },

  role: {
    type: String,
    required: true,
    enum: ['patient', 'doctor', 'pharmacist']
  },

  verified: {
    type: Boolean,
    default: false
  },

  profileId: String
})

// patient profile schema
const practitionerProfileSchema = new mongoose.Schema({
  personalInfo: {
    firstName: {
      type: String,
      // required: true,
      set: (value: string) => value.toLowerCase()
    },

    lastName: {
      type: String,
      // required: true,
      set: (value: string) => value.toLowerCase()
    },

    email: {
      type: String
    },

    languages: {
      type: [String],
      default: ['english']
    }
  },

  medicalInfo: {
    specialty: {
      type: String
      // required: true,
    },

    subSpecialty: {
      type: String
      // required: true,
    },

    licenseNumber: {
      type: String
      // required: true,
    },

    hospitalName: {
      type: String
    }
  },

  subscriptionPlan: {
    type: String,
    enum: ['free', 'basic', 'premium'],
    default: 'free'
  }
})

const patientProfileSchema = new mongoose.Schema({
  personalInfo: {
    firstName: {
      type: String,
      // required: true,
      set: (value: string) => value.toLowerCase()
    },

    lastName: {
      type: String,
      // required: true,
      set: (value: string) => value.toLowerCase()
    },

    email: {
      type: String
    },

    genotype: String,
    bloodGroup: String,
    age: Number,
    wieight: Number,
    height: Number,
    allergies: [String]
  },

  location: {
    country: String,
    state: String,
    street: String,
    houseNumber: String
  },

  subscriptionPlan: {
    type: String,
    enum: ['free', 'basic', 'premium'],
    default: 'free'
  }
})

// model function static
userSchema.statics.checkExistingUser = async function (phone: string) {
  // loop through the model to check for a specific user
  const eUser = await this.findOne({ phone })
  // console.log(eUser);

  return !!eUser
}

// document instance methods to asign function to each documenet
userSchema.methods.comparePassword = async function (commingPassword: string) {
  // use bcrypt to compare incoming password against saved password
  const currentPassword = this.password

  return new Promise((resolve, reject) => {
    bcrypt.compare(commingPassword, currentPassword, (err: any, same: any) => {
      if (err) {
        return reject(err)
      }

      resolve(same)
    })
  })
}

export const patientProfile = mongoose.model('PatientProfile', patientProfileSchema)

export const practitionerProfile = mongoose.model('PractitionerProfile', practitionerProfileSchema)

export default mongoose.model('User', userSchema)
