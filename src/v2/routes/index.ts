'use strict'

import { glob } from 'glob'
import express from 'express'
import protect from '../middlewares/Guard'
import authRoute from './auth'
import patientRoute from './patient'
import path from 'path'

const router = express.Router()

router.use(authRoute.baseUrl, authRoute.router)
router.use(patientRoute.baseUrl, protect, patientRoute.router)


export default router
