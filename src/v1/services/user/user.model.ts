import bcrypt from 'bcrypt'
import mongoose, { Schema } from 'mongoose'

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
    avatar: {
      type: String
    },
    lastName: {
      type: String,
      // required: true,
      set: (value: string) => value.toLowerCase()
    },

    email: {
      type: String
    },

    imgUrl: String,

    languages: {
      type: [String],
      default: ['english']
    }
  },

  medicalInfo: {
    specialty: {
      type: String,
      set: (value: string) => value.toLowerCase()
    },

    subSpecialty: {
      type: String,
      set: (value: string) => value.toLowerCase()
    },

    licenseNumber: {
      type: String
    },

    hospitalName: {
      type: String
    }
  },
  bio: {
    type: String,
    default: 'I am a Doctor'
  },
  availableDateAndTime: {
    type: Date,
    default: Date.now()
  },
  isAvailable: {
    type: Boolean,
    default: false
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date
  },
  consultationFee: {
    type: Number,
    default: 1500
  },
  reviews: [
    {
      review: { type: String, required: true },
      rating: { type: Number, required: true },
      reviewFrom: { type: Schema.Types.ObjectId, required: true }
    }
  ],
  yearsofExperience: {
    type: Number,
    default: 1
  },
  hospital: {
    type: String,
    default: 'No hospital yet'
  },
  rating: {
    type: Number,
    default: 0,
    max: 5
  },
  noOfAppointments: {
    type: Number,
    default: 0
  }
})

const patientProfileSchema = new mongoose.Schema({
  personalInfo: {
    firstName: {
      type: String,
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

    imgUrl: String,

    genotype: String,
    bloodGroup: String,
    age: String,
    weight: String,
    height: String,
    allergies: [String]
  },

  location: {
    country: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    },
    street: {
      type: String,
      default: ''
    },
    houseNumber: {
      type: String,
      default: ''
    }
  },

  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date
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

//method to remove password from json response
userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
 }

export const patientProfile = mongoose.model('PatientProfile', patientProfileSchema)

export const practitionerProfile = mongoose.model('PractitionerProfile', practitionerProfileSchema)

export default mongoose.model('User', userSchema)
