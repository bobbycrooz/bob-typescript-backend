import Joi from 'joi'

const prescriptionDataSchema = Joi.object({
  contact: Joi.object({
    name: Joi.string(),
    phone: Joi.string().required(),
    dob: Joi.string().required(),
    address: Joi.string()
  }),

  allergies: Joi.array().items(Joi.string()).required(),
  medicalHistory: Joi.array().items(Joi.string()).required(),
  currentMedication: Joi.array().items(Joi.string()).required(),
  complaints: Joi.string().required(),
  medicationImage: Joi.string(),

  phamacyInfo: Joi.object({
    phamacyId: Joi.string()
  }),

  deliveryMethod: Joi.string().valid('Pharmacy Pickup', 'Home Delivery').required(),
  deliveryDetails: Joi.object({
    address: Joi.string(),
    phone: Joi.string()
  })
})

export { prescriptionDataSchema }
