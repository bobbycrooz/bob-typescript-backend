import User from '../user/user.model'
import PrescriptionModel from './prescription.model'
import Services from '../../helpers/model.helper'
import { clientResponse } from '../../helpers/response'
import Logger from '../../libs/logger'
import { prescriptionDataSchema } from '../../utils/validation/prescriptionValidation'

const userService = new Services(User)
const prescriptionService = new Services(PrescriptionModel)

const createPrescription = async (req: any, res: any) => {
  try {
    // get user from request
    const currentUser = req.user

    console.log(currentUser, 'current user')

    const isDoctor = currentUser.role === 'doctor'

    const isPatient = currentUser.role === 'patient'

    // get prescription details
    const prescriptionData = req.body

    if (isDoctor && !prescriptionData.prescribedTo) {
      return clientResponse(res, 400, {
        message: `Provide the patient ID you are prescribing to.`
      })
    }

    //   validate prescription details
    // const value = await prescriptionDataSchema.validateAsync(prescriptionData)

    // create new prescription
    await prescriptionService.create({
      ...prescriptionData,
      prescribedBy: prescriptionData.prescribedBy || currentUser.id
    })

    clientResponse(res, 201, {
      message: `prescription  created successfully for user: ${prescriptionData.contact.name}`
    })

    // return response
  } catch (error: typeof Error | any) {
    Logger.error(`${error.message} from this message box`)

    // return error
    clientResponse(res, 400, error.message)
  }
}

// Get prescription by name or phone
const getPrescriptions = async (req: any, res: any) => {
  try {
    // get user from request
    const { name, phone } = req.query

    console.log(name, phone, 'details froom qurery')

    let filterBy = {}

    if (name) {
      // @ts-ignore
      filterBy = {
        'contact.name': name
      }
    }

    if (phone) {
      filterBy = {
        'contact.phone': phone
      }
    }

    console.log(filterBy)
    // create new prescription
    // const allprescriptionData = await prescriptionService.getByQuery(filterBy)
    const allprescriptionData = await PrescriptionModel.find(filterBy).populate({
      path: 'prescribedTo prescribedBy approvedBy rejectedBy',
      select: 'name phone role'
    })

    if (allprescriptionData) {
      return clientResponse(res, 201, {
        allprescriptionData
      })
    }

    // return response
  } catch (error: typeof Error | any) {
    Logger.error(`${error.message}`)

    // return error
    clientResponse(res, 400, error.message)
  }
}

// Get doctor  prescriptions history
const prescriptionHistory = async (req: any, res: any) => {
  Logger.info('prescription history ---kgot here')

  try {
    // get user from auth
    const currentUser = req.user

    // check if user is a doctor
    const isDoctor = currentUser.role === 'doctor'

    if (!isDoctor) {
      return clientResponse(res, 400, {
        message: `Only doctors can request for history.`
      })
    }

    // fetch all prescription by doctor
    const allPrescribedPres = await PrescriptionModel.find({
      $or: [
        { prescribedBy: currentUser._id },
        { approvedBy: currentUser._id },
        { rejectedBy: currentUser._id },
        { 'underReview.by': currentUser._id }
      ]
    })
      .populate({
        path: 'prescribedTo',
        select: 'name phone'
      })
      .lean()

    console.log(allPrescribedPres, `selected prescription by doctor ${currentUser.username}`)

    // update the underReview field to cancel
    if (allPrescribedPres) return clientResponse(res, 201, allPrescribedPres)

    return clientResponse(res, 400, 'somthing went wrong canceling this prescription.')
    // return response
  } catch (error: typeof Error | any) {
    Logger.error(`${error.message} from this message box ---------`)

    // return error
    clientResponse(res, 400, error.message)
  }
}

const getPrescriptionById = async (req: any, res: any) => {
  try {
    // get user from request
    const id = req.params.id

    // create new prescription
    const onePrescriptionData = await prescriptionService.getById(id)

    if (onePrescriptionData) {
      return clientResponse(res, 201, {
        onePrescriptionData
      })
    }

    // return response
  } catch (error: typeof Error | any) {
    Logger.error(`${error.message}`)

    // return error
    clientResponse(res, 400, error.message)
  }
}

const rejectPrescription = async (req: any, res: any) => {
  try {
    // get user from request
    const { id } = req.query

    // get user from request
    const currentUser = req.user

    Logger.info(currentUser._id, 'current user')

    const isDoctor = currentUser.role === 'doctor'

    if (!isDoctor) {
      return clientResponse(res, 400, {
        message: `Only doctors can approve prescriptions.`
      })
    }

    if (!id) {
      return clientResponse(res, 400, {
        message: `No prescription id provided.`
      })
    }

    //  reject the prescription
    const rejectedPes = await PrescriptionModel.findOneAndUpdate(
      { _id: id, 'underReview.by': currentUser._id },

      {
        $set: {
          rejectedBy: currentUser._id,
          status: 'rejected'
        }
      },
      { new: true }
    ).populate({
      path: 'rejectedBy',
      select: 'name phone role'
    })

    if (rejectedPes)
      return clientResponse(res, 201, {
        rejectedPes
      })

    return clientResponse(res, 400, 'This prescription is not under review by you.')

    // return response
  } catch (error: typeof Error | any) {
    Logger.error(`${error.message}`)

    // return error
    clientResponse(res, 400, error.message)
  }
}

const approvePrescription = async (req: any, res: any) => {
  try {
    // get user from request
    const { id } = req.query

    // get user from request
    const currentUser = req.user

    Logger.info(currentUser._id, 'current user')

    const isDoctor = currentUser.role === 'doctor'

    if (!isDoctor) {
      return clientResponse(res, 400, {
        message: `Only doctors can approve prescriptions.`
      })
    }

    if (!id) {
      return clientResponse(res, 400, {
        message: `No prescription id provided.`
      })
    }

    // approve the prescription
    const approvedPres = await PrescriptionModel.findOneAndUpdate(
      { _id: id, 'underReview.by': currentUser._id },

      {
        $set: {
          approvedBy: currentUser._id,
          status: 'approved',
          underReview: {
            value: false,
            by: null
          }
        }
      },
      { new: true }
    ).populate({
      path: 'approvedBy',
      select: 'name phone role'
    })

    if (approvedPres) {
      return clientResponse(res, 201, {
        approvedPres
      })
    }

    return clientResponse(res, 400, 'priscription not under review by you.')

    // return response
  } catch (error: typeof Error | any) {
    Logger.error(`${error.message}`)

    // return error
    clientResponse(res, 400, error.message)
  }
}

// select prescription for review by a doctor
const selectPrescriptionForReview = async (req: any, res: any) => {
  try {
    // get the prescription id from the request
    const id = req.params.id

    // get user from auth
    const currentUser = req.user

    // check if user is a doctor
    const isDoctor = currentUser.role === 'doctor'

    if (!isDoctor) {
      return clientResponse(res, 400, {
        message: `Only doctors can select prescriptions.`
      })
    }

    if (!id) {
      return clientResponse(res, 400, {
        message: `Provide the prescription id you want to select.`
      })
    }

    // get the prescription data from the database
    const onePrescriptionData = await prescriptionService.getById(id)

    // update the underReview field
    if (onePrescriptionData) {
      // approve the prescription
      const selectPresByDoctor = await PrescriptionModel.findOneAndUpdate(
        { _id: id, 'underReview.value': false },

        {
          $set: {
            status: 'pending',
            underReview: {
              value: true,
              by: currentUser._id
            },
            approvedBy: null,
            rejectedBy: null
          }
        },
        { new: true }
      )

      if (selectPresByDoctor)
        return clientResponse(res, 201, `Prescription now under review by ${currentUser.username}`)
    }

    return clientResponse(res, 400, 'somthing went wrong selecting this prescription.')
    // return response
  } catch (error: typeof Error | any) {
    Logger.error(`${error.message}`)

    // return error
    clientResponse(res, 400, error.message)
  }
}

const cancleSelectedPriscription = async (req: any, res: any) => {
  try {
    // get the prescription id from the request
    const id = req.params.id

    // get user from auth
    const currentUser = req.user

    // check if user is a doctor
    const isDoctor = currentUser.role === 'doctor'

    if (!isDoctor) {
      return clientResponse(res, 400, {
        message: `Only doctors can select prescriptions.`
      })
    }

    if (!id) {
      return clientResponse(res, 400, {
        message: `Provide the prescription id you want to cancel.`
      })
    }

    // check if doctore selected the prescription
    const selectedPrescriptionByDoctor = await PrescriptionModel.findOne({
      _id: id,
      'underReview.by': currentUser._id
    })

    console.log(selectedPrescriptionByDoctor, 'selected prescription by doctor ${currentUser.username}')

    // update the underReview field to cancel
    if (selectedPrescriptionByDoctor) {
      // approve the prescription
      const canclePresByDoctor = await PrescriptionModel.findOneAndUpdate(
        { _id: selectedPrescriptionByDoctor._id },
        {
          $set: {
            status: 'pending',
            underReview: {
              value: false,
              by: null
            }
          }
        },
        { new: true }
      )

      if (canclePresByDoctor) return clientResponse(res, 201, `Prescription now canceled by ${currentUser.phone}`)
    }

    return clientResponse(res, 400, 'somthing went wrong canceling this prescription.')
    // return response
  } catch (error: typeof Error | any) {
    Logger.error(`${error.message}`)

    // return error
    clientResponse(res, 400, error.message)
  }
}

const getUserTotalPrescriptions = async (req: any, res: any) => {
  try {
    const currentUser = req.user


    const modifiedPhoneNumber = '0' + currentUser.phone.slice(4)

    const totalUserPrescription = await PrescriptionModel.find({ 'contact.phone': modifiedPhoneNumber }).count()


    return clientResponse(res, 201, {
      total: totalUserPrescription
    })

    // return response
  } catch (error: typeof Error | any) {
    Logger.error(`${error.message}`)

    // return error
    clientResponse(res, 400, error.message)
  }
}

export {
  selectPrescriptionForReview,
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  rejectPrescription,
  approvePrescription,
  cancleSelectedPriscription,
  prescriptionHistory,
  getUserTotalPrescriptions
}
