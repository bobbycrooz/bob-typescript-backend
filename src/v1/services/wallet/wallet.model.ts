import mongoose, { Schema, Document } from 'mongoose';


const WalletSchema = new mongoose.Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      balance: {
        type: Number,
        default: 0,
      },
    
  })
  
  export default mongoose.model('Wallet', WalletSchema)