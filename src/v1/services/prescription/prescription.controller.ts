import User from '../user/user.model'
import PrescriptionModel from './prescription.model'
import Services from '../../helpers/model.helper'
import { clientResponse } from '../../helpers/response'
import Logger from '../../iibs/logger'
import { prescriptionDataSchema } from '../../utils/validation/prescriptionValidation'

const userService = new Services(User)
const prescriptionService = new Services(PrescriptionModel)

const createPrescription = async (req: any, res: any) => {
  try {
    // get user from request
    const currentUser = req.user
    // get prescription details 
    const prescriptionData = req.body

    //   validate prescription details
    const value = await prescriptionDataSchema.validateAsync(prescriptionData)

    if (value) console.log(value)

    // create new prescription
    await prescriptionService.create(prescriptionData)

    clientResponse(res, 201, {
      message: `prescription  created successfully for user: ${prescriptionData.name}`
    })

    // return response
  } catch (error: typeof Error | any) {
    Logger.error(`${error.message}`)

    // return error
    clientResponse(res, 400, error.message)
  }
}

const getPrescriptions = async (req: any, res: any) => {
  try {
    // get user from request
    const { name, phone } = req.query

    const filterBy: {
      name?: string
      phone?: string
    } = {}

    if (name) {
      filterBy.name = name
    }

    if (phone) {
      filterBy.phone = phone
    }

    // create new prescription
    const allprescriptionData = await prescriptionService.getByQuery(filterBy)

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

export { createPrescription, getPrescriptions, getPrescriptionById }
