import User from '../user/user.model'
import Services from '../../helpers/model.helper'
import { clientResponse } from '../../helpers/response'
import { validateAndFormat } from '../../utils'
import Logger from '../../libs/logger'
import walletModel from '../wallet/wallet.model'
import argon2 from 'argon2'

const userService = new Services(User)
const walletService = new Services(walletModel)

// login
const createUser = async (req: any, res: any) => {
  const { username, email, password } = req.body

  try {
    if (!username) throw new Error('Name is required')
    if (!email) throw new Error('Email is required')
    if (!password) throw new Error('Password is required')

    // const isExisting = await userService.getOne({ username })
    const isExisting = await User.findOne({ $or: [{ username }, { email }]}).populate({
      path: 'connections',  
      select: 'username email profileImage'
    })
    

    if (isExisting) {
      return clientResponse(res, 201, {
        message: 'User already registered!',
        user: isExisting
      })
    }

    // hash password
    const hashedPassword = await argon2.hash(password)

    const newUser = {
      username,
      email,
      password: hashedPassword
    }

    const saveUser = await userService.create(newUser)

    if (saveUser) {
      return clientResponse(res, 201, {
        message: 'Account created!',
        user: saveUser
      })
    }

    throw new Error("we couldn't create a user")
  } catch (error: any) {
    Logger.error(`${error.message}`)

    clientResponse(res, 400, { error: error.message, message: 'there was a problem retrieving your profile' })
  }
}

const editProfile = async (req: any, res: any) => {
  
  try {
    const { email, fullName, bio, profileImage } = req.body
    // const isExisting = await userService.getOne({ username })
    const isExisting = await User.findOneAndUpdate({ email }, { fullName, bio, profileImage }, { new: true })

    if (isExisting) {
      return clientResponse(res, 201, {
        message: 'Profile edited!',
        user: isExisting
      })
    }

    throw new Error("we couldn't create a user")
  } catch (error: any) {
    Logger.error(`${error.message}`)

    clientResponse(res, 400, { error: error.message, message: 'there was a problem retrieving your profile' })
  }
}

const logIn = async (req: any, res: any) => {
  const { email, password } = req.body

  try {
    if (!email) throw new Error('Email is required')
    if (!password) throw new Error('Password is required')

    // const isExisting = await userService.getOne({ username })
    const isExisting = await User.findOne({ email }).populate({
      path: 'connections',
      select: 'username email profileImage'
    })

    if (!isExisting) {
      return clientResponse(res, 404, {
        message: 'No account found for this user!!'
      })
    }

    console.log(isExisting, 'from the log in ')

    // compare password

    const match = await argon2.verify(isExisting.password, password)

    // @ts-ignore
    if (match) {
      return clientResponse(res, 200, {
        message: 'Log in successfull!',
        user: isExisting
      })
    }

    throw new Error("we couldn't log you in")
  } catch (error: any) {
    Logger.error(`${error.message}`)

    clientResponse(res, 400, { error: error.message, message: 'there was a problem retrieving your profile' })
  }
}

const getUsers = async (req: any, res: any) => {
  const { id } = req.query

  let filterBy = {}

  if (id) {
    filterBy = {
      _id: id
    }
  }

  try {
    const user = await User.find(filterBy)
      .populate({
        path: 'connections',
        select: 'username email profileImage'
      })
      .lean()
    // const user = await User.find(filterBy)
    

    if (user) return clientResponse(res, 201, {
      message: 'Users found!',
      user: user
    } )

    throw new Error('There are no users')
  } catch (error: any) {
    Logger.error(`${error.message}`)

    clientResponse(res, 400, { error: error.message, message: 'There was a problem getting users' })
  }
}

const connetToUser = async (req: any, res: any) => {
  const { myId, peerId } = req.body

  try {
    const addMeToUserList = await User.findOneAndUpdate(
      { _id: peerId },
      { $push: { connections: myId } },
      { new: !true }
    )

    const addUserToMyList = await User.findOneAndUpdate(
      { _id: myId },
      { $push: { connections: peerId } },
      { new: true }
    )

    if (addMeToUserList && addUserToMyList) {
      return clientResponse(res, 201, {
        message: 'Connected!',
        user: addUserToMyList
      })
    }

    throw new Error('There are no users')
  } catch (error: any) {
    Logger.error(`${error.message}`)

    clientResponse(res, 400, { error: error.message, message: 'There was a problem getting users' })
  }
}
export { createUser, getUsers, logIn, connetToUser, editProfile }
