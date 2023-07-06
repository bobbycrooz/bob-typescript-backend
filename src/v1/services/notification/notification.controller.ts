import User from '../user/user.model'
import Services from '../../helpers/model.helper'
import { clientResponse } from '../../helpers/response'
import { asignNewToken } from '../../helpers/token'
import { validateAndFormat } from '../../utils'
import Logger from '../../iibs/logger'
import Notification from './notification.model'

const notificationService = new Services(User)

// login
const getNotifications = async (req: any, res: any) => {
  try {
    const currentUser = req.user

    // find all noti by user
    const allNoti = await Notification.find({ recipent: currentUser.id }).lean()

    if (!allNoti) throw new Error('No notificatons for this user')

    clientResponse(res, 200, allNoti)
  } catch (error: any) {
    Logger.error('${error.message}')

    clientResponse(res, 400, { error: error.message, message: 'there was a problem retrieving your profile' })
  }
}

// login
const getNotificationByID = async (req: any, res: any) => {
  try {
    const id = req.param.id

    const currentUser = req.user

    // find all noti by user
    const oneNoti = await Notification.findOne({ recipent: currentUser.id, id }).lean()

    if (!oneNoti) throw new Error('No notificatons found for the id')

    clientResponse(res, 200, oneNoti)
  } catch (error: any) {
    Logger.error(`${error.message}`)

    clientResponse(res, 400, { error: error.message, message: 'there was a problem retrieving your notification' })
  }
}

const markNotificationRead = async (req: any, res: any) => {
  try {
    const id = req.param.id

    const currentUser = req.user

    // find all noti by user
    const markedNoti = await Notification.findOneAndUpdate({ id }, { isRead: true }).lean()

    if (!markedNoti) throw new Error('No notificatons found for the id')

    clientResponse(res, 200, markedNoti)
  } catch (error: any) {
    Logger.error(`${error.message}`)

    clientResponse(res, 400, { error: error.message, message: 'there was a problem retrieving your notification' })
  }
}

const markNotificationunRead = async (req: any, res: any) => {
  try {
    const id = req.param.id

    const currentUser = req.user

    // find all noti by user
    const markedNoti = await Notification.findOneAndUpdate({ id }, { isRead: false }).lean()

    if (!markedNoti) throw new Error('No notificatons found for the id')

    clientResponse(res, 200, markedNoti)
  } catch (error: any) {
    Logger.error(`${error.message}`)

    clientResponse(res, 400, { error: error.message, message: 'there was a problem retrieving your notification' })
  }
}

const deleteNotification = async (req: any, res: any) => {
  try {
    const id = req.param.id

    const currentUser = req.user

    // find all noti by user
    const deleteddNoti = await Notification.findOneAndDelete({ id }).lean()

    if (!deleteddNoti) throw new Error('No notificatons found for the id')

    clientResponse(res, 200, deleteddNoti)
  } catch (error: any) {
    Logger.error(`${error.message}`)

    clientResponse(res, 400, { error: error.message, message: 'there was a problem retrieving your notification' })
  }
}

export { getNotifications, getNotificationByID, markNotificationRead, deleteNotification, markNotificationunRead }
