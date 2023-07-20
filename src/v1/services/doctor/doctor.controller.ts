import User from '../user/user.model'
import Services from '../../helpers/model.helper'
import { clientResponse } from '../../helpers/response'
import { asignNewToken } from '../../helpers/token'
import { validateAndFormat } from '../../utils'
import Logger from '../../libs/logger'
import { patientProfile, practitionerProfile } from '../user/user.model'

const userService = new Services(User)

// login
const availableDoctor = async (req: any, res: any) => {

  try {

    const currentUser = req.user

      const availableDoc = await practitionerProfile.find({ isAvailable: true }).lean()

      if (!availableDoc) throw new Error('No available doctor')





    clientResponse(res, 200, {
      doctors: availableDoc
    })
  } catch (error: any) {
    Logger.error(`${error.message}`)

    clientResponse(res, 400, { error: error.message, message: 'there was a problem retrieving your profile' })
  }
}


const getUserByprofileId = async (req: any, res: any) => {
  // const { phone, password } = req.body

  const { id } = req.params

  try {
    // if (!phone || !password) throw new Error('phone and password are required')

    // const currentUser = req.user

    // const user = await userService.getById(id)

    const user = await User.findOne({ profileId: id }).select({password: 0}).lean()

    if (!user)
    {
         return clientResponse(res, 400, {
          
           message: 'No user with this profile id.'
         })
     
    }
    clientResponse(res, 201, user as any)
  } catch (error: any) {
    Logger.error(`${error.message}`)

    clientResponse(res, 400, { error: error.message, message: 'There was a problem getting the users profile.' })
  }
}

export { availableDoctor, getUserByprofileId }
