import mongoose, { Schema, Document } from 'mongoose'

const UrlSchema = new mongoose.Schema({
  shortLink: {
    type: String,
    required: false,
    default: ''
  }, 
  longLink: {
    type: String,
    required: true,
    default: ''
  },
  visitors: {
    type: Number,
    required: false,
    default: 0
  },
})

export default mongoose.model('Url', UrlSchema)
