import express, { NextFunction, Request, Response } from 'express'
import Logger from './iibs/logger'
import cors from 'cors'
import morganMiddleware from './middlewares/morgan'
import { ErrorCode, ErrorException, errorHandler } from './utils'
import apiRoutes from './routes'
import bodyParser from 'body-parser'
import config from './config'
import DB from './helpers/database'
import { clientResponse } from './helpers'
const app = express()

app.disable('x-powered-by')

// Middlewares
const initMiddlewares = () => {
  app.use(cors())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(morganMiddleware)
  app.use(errorHandler)
}

// app.get('/b', (req: Request, res: Response, next: NextFunction) => {
//   throw new ErrorException(ErrorCode.MaximumAllowedGrade, { grade: Math.random() })
//   // or
//   // next(new ErrorException(ErrorCode.MaximumAllowedGrade, { grade: Math.random() }))
// })
// app.use('/auth', apiRoutes)

// routes
const initRoutes = () => {
  app.use('/v1', apiRoutes)
  app.all('/', (req:any, res:any) => {
    clientResponse(res, 200, 'welcome to the xyz backend server <3')
  })
  app.all('**', (req:any, res:any) => clientResponse(res, 401, 'Route not found, try check your browser url'))

  Logger.info('Routers initialized <3')
}

// database
const initDataBaseConnection = async () => {
  await DB.connect()
  Logger.info('database connected, happy hacking 💖')
  return true

}

const initProcessHandler = () => {
  process.on('uncaughtException', (err) => {
  Logger.info('there was an uncaught exception, shutting down! 🤬🤬', err)

  })

  process.on('unhandledRejection', (err) => {
    Logger.info('this rejection wasnt handled, shutting down! 🤬🤬', err)
    process.exit(1)

  })
}

const initServer = (port: number | string) => {
  app.listen(port, () =>
    // console.log(`Server running, Our app is live on PORT: ${port}`)
    Logger.info(`Server running 🏃‍♂️🏃‍♀️, Our app is live 🥳🙌 on PORT: ${port}`)
  )
}

export default {
  start: async () => {

    const dbConnected = await initDataBaseConnection()

    if (dbConnected)
    {
      initMiddlewares()
      
      initRoutes()

      initServer(config.PORT || 3000)

      initProcessHandler()
    }
  
  }

  // stop: () => {}
}
