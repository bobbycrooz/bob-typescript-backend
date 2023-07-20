import 'dotenv/config'

export default {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  SECRET: process.env.SECRET,
  NODE_ENV: process.env.NODE_ENV,
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_SECRET: process.env.CLOUDINARY_API_SECRET,
  TERMI_API_KEY: process.env.TERMI_API_KEY
}
