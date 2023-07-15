import Joi from 'joi'

const transactionValidationSchema = Joi.object({
    transactionId: Joi.string().required(),
    userId: Joi.string(),
    amount: Joi.number().required(),
    paymentType: Joi.string().valid('WALLET', 'SUBSCRIPTION', 'CONSULTATION', 'DRUGS').required(),
    status: Joi.string().valid('PENDING', 'FAILED', 'SUCCESSFUL').default('PENDING')
  });

export { transactionValidationSchema }