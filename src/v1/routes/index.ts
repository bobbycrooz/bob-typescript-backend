'use strict'

import { glob } from 'glob'
import express from 'express'
import authenticate from '../middlewares/Guard'

// const authMiddleWare = require('../app/middlewares')

const router = express.Router() 
glob
  .sync('*ts', {
    cwd: __dirname,
    ignore: 'index.ts'
  })
  .forEach(async (file: any) => {
    //
    const fileRoutes = await import(`./${file}`)

    if (fileRoutes.auth) router.use(fileRoutes.default.baseUrl, authenticate, fileRoutes.default.router)
    else router.use(fileRoutes.default.baseUrl, authenticate, fileRoutes.default.router)
  })

export default router
