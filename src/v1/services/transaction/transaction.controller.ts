import User from '../user/user.model'
import TransactiontModel from './transaction.model'
import { practitionerProfile, patientProfile } from '../user/user.model'
import Services from '../../helpers/model.helper'
import { clientResponse } from '../../helpers/response'
import Logger from '../../iibs/logger';
import { transactionValidationSchema } from '../../utils/validation/index'
import walletModel from '../wallet/wallet.model'

const userService = new Services(User)
const transactionService = new Services(TransactiontModel);


const createTransaction = async (req:any, res:any) => {
    try {
        const currentUser = req.user;

        const transactionData = req.body;

        const transactionValue = await transactionValidationSchema.validateAsync(transactionData);

        console.log(transactionValue);
        

        const transaction = new TransactiontModel({
            ...transactionData,
            userId: transactionData.userId || currentUser._id
        })

        const result = await transaction.save();

        const transactionType = result.paymentType;
        const user = result.userId;
        const transactionAmount = result.amount;        

        if (transactionType == "WALLET") {
            const wallet = await walletModel.findOne({userId: user});

        if (wallet) {
            const updateWallet = wallet.balance + transactionAmount;
            wallet.balance = updateWallet;

            await wallet.save();

            clientResponse(res,201, {
                result: result,
                wallet: wallet
            })
            
        }else{
            const newWallet = new walletModel({ userId: user?._id, balance: transactionAmount });
          await newWallet.save();
            clientResponse(res,201, {
                result: result,
                wallet: newWallet
            })
        }
        }

    else if (transactionType == "SUBSCRIPTION") {
        clientResponse(res,201, {
            result: result,
        })
    }
   
    } 
    catch (error: typeof Error | any) {
        Logger.error(`${error.message}`)
        clientResponse(res, 400, error.message)
      }
}


export { createTransaction }