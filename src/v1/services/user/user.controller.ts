import User from '../user/user.model'
import Services from '../../helpers/model.helper'
import { clientResponse } from '../../helpers/response'
import { asignNewToken } from '../../helpers/token'
import { validateAndFormat } from '../../utils'
import Logger from '../../iibs/logger'
import { patientProfile, practitionerProfile } from './user.model'

const userService = new Services(User)

// login
const profile = async (req: any, res: any) => {
  // const { phone, password } = req.body

  try {
    // if (!phone || !password) throw new Error('phone and password are required')

    const currentUser = req.user

    if (currentUser.profile === '')
    {
      return clientResponse(res, 400, {
        message: `You need to update your profile first.`
      })
    }

    // fetch user profile base on role
    if (currentUser.role === 'patient')
    {
      const profile = await patientProfile.findOne({ _id: currentUser.profile }).lean()

      if (!profile) throw new Error('profile not found')

      currentUser.profile = profile
    } else if (currentUser.role === 'doctor')
    {
      const profile = await practitionerProfile.findOne({ _id: currentUser.profile }).lean()

      if (!profile) throw new Error('profile not found')

      currentUser.profile = profile
    }


    clientResponse(res, 201, currentUser)

  } catch (error: any) {
    Logger.error('${error.message}')

    clientResponse(res, 400, { error: error.message, message: 'there was a problem retrieving your profile' })
  }
}

const getProfileById = async (req: any, res: any) => {
  // const { phone, password } = req.body

  const { id } = req.params

  try {
    // if (!phone || !password) throw new Error('phone and password are required')

    // const currentUser = req.user

    // const user = await userService.getById(id)

    const userProfile = await User.findById(id).populate('profile')

  

    if (!userProfile || userProfile.profile == "" as any) throw new Error('user not found')

    clientResponse(res, 201, userProfile.profile as any)

  } catch (error: any)
  {
    
    Logger.error('${error.message}')

    clientResponse(res, 400, { error: error.message, message: 'There was a problem getting the users profile.' })
  }
}

const updateProfile = async (req: any, res: any) => {
  try {
    const data = req.body
    

    // get user from request
    const currentUser = req.user


    // create a new user profile if it doesnt exist
    if (currentUser.profile === '')
    {
      
      if (currentUser.role === 'patient')
      {
        const newProfile = await patientProfile.create(data)

        // update user model to have profile id
        await userService.update(currentUser._id, { profile: newProfile._id })

        currentUser.profile = newProfile._id
      }
      else if (currentUser.role === 'doctor')
      {
        const newProfile = await practitionerProfile.create(data)

        // update user model to have profile id
        await userService.update(currentUser._id, { profile: newProfile._id })

        currentUser.profile = newProfile._id
      }
    } else
    {
      // update user profile, since it exist.
      if (currentUser.role === 'patient')
      {
        const updateProfile = await patientProfile.updateOne({ _id: currentUser.profile }, data)

        if (!updateProfile) throw new Error('profile not found')

        currentUser.profile = updateProfile

      } else if (currentUser.role === 'doctor')
      {
        const updateProfile = await practitionerProfile.updateOne({ _id: currentUser.profile }, data)

        if (!updateProfile) throw new Error('profile not found')

        currentUser.profile = updateProfile
      }
    }



      return clientResponse(res, 201, 'Profile has been updated succesfully.')

    // return response
  } catch (error: typeof Error | any)
  {
    
    Logger.error(`${error.message}`)

    // return error
    clientResponse(res, 400, error.message)
  }
}

export { profile, updateProfile, getProfileById }
