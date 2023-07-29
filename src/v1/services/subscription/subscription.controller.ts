import User from '../user/user.model'
import Services from '../../helpers/model.helper'
import Subscription from "./subscription.model";

const subscriptionService = new Services(Subscription)

// const getUserSubscription = async (req: any, res: any) => {
//   try {
//     const currentUser = req.user

//     // find all noti by user
//     const allNoti = await Notification.find({ recipent: currentUser.id }).lean()

//     if (!allNoti) throw new Error('No notificatons for this user')

//     clientResponse(res, 200, allNoti)
//   } catch (error: any) {
//     Logger.error('${error.message}')

//     clientResponse(res, 400, { error: error.message, message: 'there was a problem retrieving your profile' })
//   }
// }

export {  }