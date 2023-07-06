import Joi from 'joi'

const prescriptionDataSchema = Joi.object({
  contact: Joi.object({
    name: Joi.string().allow(''),
    phone: Joi.string().required(),
    dob: Joi.string().required(),
    address: Joi.string().allow('')
  }),

  allergies: Joi.array().items(Joi.string()).required(),

  medicalHistory: Joi.array().items(Joi.string()).required(),

  currentMedication: Joi.array().items(Joi.string()).required(),
  medications: Joi.array().items(Joi.object({
    name: Joi.string(),
    quantity: Joi.number()
  })).required,

  complaints: Joi.string().required(),

  medicationImage: Joi.string(),

  phamacyInfo: Joi.object({
    phamacyId: Joi.string()
  }),

  deliveryMethod: Joi.string().valid('Pharmacy Pickup', 'Home Delivery').required(),

  status: Joi.string().valid('approved', 'rejected', 'pending'),

  deliveryDetails: Joi.object({
    address: Joi.string().allow(''),

    phone: Joi.string().allow(''),

    status: Joi.string().valid('pending', 'delivered', 'in transit')
  }),

  prescribedTo: Joi.string(),
  prescribedBy: Joi.string(),

  underReview: Joi.object({
    value: Joi.boolean(),
    by: Joi.string()
  })
})

export { prescriptionDataSchema }
