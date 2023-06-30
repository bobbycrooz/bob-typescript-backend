import Joi from 'joi'


const prescriptionDataSchema = Joi.object({
      name: Joi.string().required(),
      phone: Joi.string().required(),
      dob: Joi.number().integer().min(1900).max(2013).required(),
      address: Joi.string(),
      allergies: Joi.array().items(Joi.string()).required(),
      medicalHistory: Joi.array().items(Joi.string()).required(),
      currentMedication: Joi.array().items(Joi.string()).required(),
      complaints: Joi.string().required(),
      medicationImage: Joi.string(),
      phamacyId: Joi.string(),
      deliveryMethod: Joi.string().valid('Pharmacy Pickup', 'Home Delivery').required(),
      deliveryDetails: Joi.object({
            address: Joi.string(),
            phone: Joi.string()
      }),

})


export { prescriptionDataSchema }