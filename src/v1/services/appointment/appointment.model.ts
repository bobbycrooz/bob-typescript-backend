import bcrypt from 'bcrypt'
import { any } from 'joi';
import mongoose, { Schema, Document } from 'mongoose';


const AppointmentSchema = new mongoose.Schema({
    doctorType: {
      type: String,
      required:true,
      default: "GeneralPractioner"
    },
    doctorAppointmentFee: {
      type:Number,
      required: true,
      // default: 5000,
     
    },
    patientId:{
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    doctorId:{
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    patientNotes: {
      type:String,

    },
    appointmentDate:{
      type: Date,
      
    },
    medicalImage: {
      type: [String]
    },
    review:{
      type: String
    },
    meetingLink:{
      type: String
    },
    rating: {
      type: Number,
      default: 1,
      max: 5
    },
    status:{
      type: String,
      enum: ['PENDING', 'APPROVED', 'COMPLETED', 'CANCELLED' ],
      default: "PENDING"
    },
    reasonForCancellation: {
      type: String
    }
    
    
  })
  
  export default mongoose.model('Appointment', AppointmentSchema)