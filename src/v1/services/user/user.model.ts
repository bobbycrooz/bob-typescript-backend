// import bcrypt from 'bcrypt'
import mongoose, { Schema } from 'mongoose'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    // required: true,
    set: (value: string) => value.toLowerCase(),
    default: 'user1'
  },

  email: {
    type: String,
    required: true,
    set: (value: string) => value.toLowerCase(),
    default: ''
  },

  password: {
    type: String,
    // required: true,
    default: ''
  },

  fullName: {
    type: String,
    // required: true,
    default: ''
  },
  bio: {
    type: String,
    // required: true,
    default: ''
  },
  connections:  [
      {
        type: Schema.Types.ObjectId,
        ref: 'AbbeyUser'
      }
    ]
  ,

  profileImage: {
    type: String,
    default: ''
  },

  
})

// model function static
userSchema.statics.checkExistingUser = async function (phone: string) {
  // loop through the model to check for a specific user
  const eUser = await this.findOne({ phone })
  // console.log(eUser);

  return !!eUser
}

// document instance methods to asign function to each documenet
// userSchema.methods.comparePassword = async function (commingPassword: string) {
//   // use bcrypt to compare incoming password against saved password
//   const currentPassword = this.password

//   return new Promise((resolve, reject) => {
//     bcrypt.compare(commingPassword, currentPassword, (err: any, same: any) => {
//       if (err) {
//         return reject(err)
//       }

//       resolve(same)
//     })
//   })
// }

//method to remove password from json response
userSchema.methods.toJSON = function () {
  var obj = this.toObject()
  delete obj.password
  return obj
}

export default mongoose.model('AbbeyUser', userSchema)
