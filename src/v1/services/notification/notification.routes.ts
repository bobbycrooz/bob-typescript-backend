import { Router } from 'express'
import {
  getNotifications,
  getNotificationByID,
  markNotificationRead,
  deleteNotification,
  markNotificationunRead
} from './notification.controller'

const router = Router()

router.get('/', getNotifications)

router.get('/:id', getNotificationByID)

router.patch('/:id/read', markNotificationRead)

router.patch('/:id/unread', markNotificationunRead)

router.delete('/:id', deleteNotification)

export default {
  baseUrl: '/notification',
  router,
  auth: true
}
