import { Router } from 'express'
import express, { NextFunction, Request, Response } from 'express'
import { ErrorCode, ErrorException } from '../../utils/'
import { createTransaction } from "./transaction.controller";

const router = Router();

router.post('/', createTransaction);


export default {
  baseUrl: '/transaction',
  router,
  auth: true
}