// import bcrypt from 'bcrypt'
import mongoose, { Schema } from 'mongoose'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    // required: true,
    set: (value: string) => value.toLowerCase()
  },

  wallets: {
    idOne: {
      type: Schema.Types.ObjectId,
      ref: 'TestWallet',
      required: true
    },

    idTwo: {
      type: Schema.Types.ObjectId,
      ref: 'TestWallet',
      required: false
    }
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

export default mongoose.model('TestUser', userSchema)
