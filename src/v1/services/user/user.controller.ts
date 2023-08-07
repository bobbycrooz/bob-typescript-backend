import User from '../user/user.model'
import Services from '../../helpers/model.helper'
import { clientResponse } from '../../helpers/response'
import { validateAndFormat } from '../../utils'
import Logger from '../../libs/logger'
import walletModel from '../wallet/wallet.model'

const userService = new Services(User)
const walletService = new Services(walletModel)

// login
const createUser = async (req: any, res: any) => {
  const { username } = req.body

  try {
    if (!username) throw new Error('Name is required')

    const isExisting = await userService.getOne({ username })

    if (isExisting) {
      // return error
      throw new Error('User already exists')
    }

    // create new wallet
    const newWallet = await walletService.create({
      owner: username
    })

    if (!newWallet) {
      throw new Error("we couldn't create a wallet for this user")
    }

    const newUser = {
      username,

      wallets: {
        idOne: newWallet._id
      }
    }

    const saveUser = await userService.create(newUser)

    if (saveUser) {
      return clientResponse(res, 201, newUser)
    }

    throw new Error("we couldn't create a user")
  } catch (error: any) {
    Logger.error(`${error.message}`)

    clientResponse(res, 400, { error: error.message, message: 'there was a problem retrieving your profile' })
  }
}

const getUsers = async (req: any, res: any) => {
  // const { phone, password } = req.body

  try {
    const user = await User.find({}).populate('wallets.idOne').lean()

    if (user) return clientResponse(res, 201, user as any)

    throw new Error('There are no users')
  } catch (error: any) {
    Logger.error(`${error.message}`)

    clientResponse(res, 400, { error: error.message, message: 'There was a problem getting users' })
  }
}

const fundWallet = async (req: any, res: any) => {
  try {
    const { username, amount } = req.body

    if (amount < 100) throw new Error('Minimum amount to fund is 100')

    const updateUserWallet = await walletModel.findOneAndUpdate(
      { owner: username },
      { 'balance.value': amount },
      { new: true }
    ).lean()

    if (updateUserWallet) return clientResponse(res, 201, `wallet funded with ${amount}, ballance: ${updateUserWallet.balance?.value}`)

    clientResponse(res, 400, "something went wrong")


    // return response
  } catch (error: typeof Error | any) {
    Logger.error(`${error.message}`)

    // return error
    clientResponse(res, 400, error.message)
  }
}

const sendMoney = async (req: any, res: any) => {
  try {
    const { username, amount, recipentName } = req.body

    if (amount < 100) throw new Error('Minimum amount to fund is 100')

    const getUsersBal = await User.findOne({ username }).populate('wallets.idOne').select('balance')

    // @ts-ignore
    console.log(getUsersBal.wallets?.idOne?.balance.value, amount)

    if (!getUsersBal) throw new Error('User does not exist')

    // @ts-ignore
    if (getUsersBal.wallets?.idOne?.balance.value < amount) {
      throw new Error('Insuficient funds in wallet')
    } else {
      // finde recipent wallet
      const updateUserWallet = await walletModel
        .findOneAndUpdate(
          { owner: recipentName },
          {
            $inc: { 'balance.value': amount }
          },
          { new: true }
        )
        .lean()

      // deduct
      const deductUserWallet = await walletModel
        .findOneAndUpdate(
          { owner: username },
          {
            $inc: { 'balance.value': -amount }
          },
          { new: true }
        )
        .lean()


      if (updateUserWallet) return clientResponse(res, 201, `Sent ${amount} NGN to ${recipentName}`)

      throw new Error('No recipent with that name')
    }
  } catch (error: typeof Error | any) {
    Logger.error(`${error.message}`)

    // return error
    clientResponse(res, 400, error.message)
  }
}
export { createUser, getUsers, fundWallet, sendMoney }
