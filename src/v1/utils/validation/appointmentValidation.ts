import Joi from 'joi'

const appointmentValidationSchema = Joi.object({
    doctorType: Joi.string().required(),
    doctorAppointmentFee: Joi.number().required(),
    patientId: Joi.string().required(),
    doctorId: Joi.string().required(),
    patientNotes: Joi.string().allow(''),
    appointmentDate: Joi.date(),
    medicalImage: Joi.array().items(Joi.string()),
    review: Joi.string(),
    rating: Joi.number().default(0)
  });

export { appointmentValidationSchema }