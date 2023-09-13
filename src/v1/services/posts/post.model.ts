import mongoose, { Schema, Document } from 'mongoose'

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
    // required: true
  },
  body: {
    type: String,
    required: true,
    default: ''
  },

  uuid: {
    type: Schema.Types.ObjectId,
    ref: 'AbbeyUser'
  }
})

export default mongoose.model('Post', PostSchema)
