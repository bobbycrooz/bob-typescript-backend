import User from '../user/user.model'
import Services from '../../helpers/model.helper'
import { clientResponse } from '../../helpers/response'
import { validateAndFormat } from '../../utils'
import Logger from '../../libs/logger'
import walletModel from './wallet.model'

const walletService = new Services(walletModel)

// login
const getWallets = async (req: any, res: any) => {
  try {
    //   let walletId = req.query.id;

    const wallets = await walletModel.find().populate("owner")

    console.log(wallets);
    

    if (wallets) {
      return clientResponse(res, 201, wallets)
    }

    clientResponse(res, 404, 'No wallets found ')
  } catch (error: any) {
    Logger.error(`${error.message}`)

    clientResponse(res, 400, { error: error.message, message: 'there was a problem retrieving wallets' })
  }
}

const getWalletById = async (req: any, res: any) => {
  const { id } = req.params

  try {
    const wallet = await walletService.getById(id)
    

    if (wallet) { 
      return clientResponse(res, 201, wallet)
    }

    clientResponse(res, 404, 'No wallet found ')
  } catch (error: any) {
    Logger.error(`${error.message}`)

    clientResponse(res, 400, { error: error.message, message: 'There was a problem getting the wallet with that ID.' })
  }
}

export { getWallets, getWalletById }
