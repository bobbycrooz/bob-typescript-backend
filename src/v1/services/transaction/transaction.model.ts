import { any } from 'joi';
import mongoose, { Schema, Document } from 'mongoose';


const TransactionSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        required: true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    amount: {
        type: Number,
        required: true
    },
    paymentType: {
        type: String,
        enum: ['WALLET', 'SUBSCRIPTION', 'CONSULTATION','DRUGS'],
    },
    
    status:{
      type: String,
      enum: ['PENDING', 'FAILED', 'SUCCESSFUL'],
      default: "PENDING"
    },

  })
  
  export default mongoose.model('Transactions', TransactionSchema)