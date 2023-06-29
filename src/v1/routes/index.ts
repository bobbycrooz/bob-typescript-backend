'use strict'

import { glob } from 'glob'
import express from 'express'
import protect from '../middlewares/Guard'

// const authMiddleWare = require('../app/middlewares')

console.log('router her ---------------------');


const router = express.Router() 
glob
  .sync('*ts', {
    cwd: __dirname,
    ignore: 'index.ts'
  })
  .forEach(async (file: any) => {
    //
    const fileRoutes = await import(`./${file}`)

    if (fileRoutes.default.auth) router.use(fileRoutes.default.baseUrl, protect, fileRoutes.default.router)
    else router.use(fileRoutes.default.baseUrl, fileRoutes.default.router)
  })

  console.log(router)

export default router
