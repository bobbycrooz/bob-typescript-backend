import User from '../user/user.model'
import AppointmentModel from './appointment.model'
import { practitionerProfile, patientProfile } from '../user/user.model'
import Services from '../../helpers/model.helper'
import { clientResponse } from '../../helpers/response'
import Logger from '../../libs/logger'
import { appointmentValidationSchema } from '../../utils/validation/appointmentValidation'
import { generateMeetingLink } from "../../helpers/googleMeet";
import calendly from "node-calendly";

const userService = new Services(User)
const appointmentService = new Services(AppointmentModel)







const getAllGeneralPractitioners = async (req: any, res: any) => {
  try {
    // const allDoctors = await practitionerProfile.find();

    // let today =  "2023-07-15T08:23:07.008Z"

        const users = await practitionerProfile.find();
        const allDoctorsResult = users.map((user) => ({
          id: user.id,
          firstName: user.personalInfo?.firstName,
          lastName: user.personalInfo?.lastName,
          bio: user.bio, 
          avaialableTime: user.availableDateAndTime,
          avatar: user.personalInfo?.avatar,
          ratings: user.rating,
          consultationFee: user.consultationFee,
          yearsOfExperience: user.yearsofExperience,
          hospitalName: user.hospital,
          noOfReviews: user.reviews.length,
        }));

    clientResponse(res, 200, {
      allDoctors: allDoctorsResult
    })
  } catch (error: typeof Error | any) {
    Logger.error(`${error.message}`)

    // return error
    clientResponse(res, 400, error.message)
  }
}

const getSpecialists = async (req: any, res: any) => {
  const { specialty } = req.body

  try {
    const allSpecialists = await practitionerProfile.find({ 'medicalInfo.specialty': specialty })

    clientResponse(res, 200, {
      allSpecialists: allSpecialists
    })
  } catch (error: typeof Error | any) {
    Logger.error(`${error.message}`)

    // return error
    clientResponse(res, 400, error.message)
  }
}

const getDoctorProfile = async (req: any, res: any) => {
  const id = req.params.id

  try {
    const doctor = await practitionerProfile.findOne({ _id: id })

    if (doctor) {
      return clientResponse(res, 200, {
        doctor: doctor
      })
    }
  } catch (error: typeof Error | any) {
    Logger.error(`${error.message}`)

    // return error
    clientResponse(res, 400, error.message)
  }
}

const createAppointment = async (req: any, res: any) => {
  try {
    const currentUser = req.user

    const isPatient = currentUser.role === 'patient'
    const appointmentData = req.body

    console.log(appointmentData)

    if (isPatient && !appointmentData.doctorId) {
      return clientResponse(res, 400, {
        message: `Provide the doctor Id you are creating an appointment.`
      })
    }

    const value = await appointmentValidationSchema.validateAsync(appointmentData)

    console.log(value)

    const meetingLink = generateMeetingLink()

    const appointment = new AppointmentModel({
      ...appointmentData,
      patientId: appointmentData.patientId || currentUser.id,
      meetingLink: meetingLink
    })

    const result = await appointment.save()

    const doctorId = result.doctorId

    console.log(`docotr: ${doctorId}`)

    if (appointment) {
      const doctor = await User.findOne({ _id: doctorId })
      if (doctor) {
        const doctorProfile = await practitionerProfile.findByIdAndUpdate(doctor.profileId, {
          $inc: { noOfAppointments: 1 }
        })

        await doctorProfile?.save()
        clientResponse(res, 201, {
          appointment: appointment,
          doctor: doctorProfile
        })
      }
    }
  } catch (error: typeof Error | any) {
    Logger.error(`${error.message}`)

    // return error
    clientResponse(res, 400, error.message)
  }
}

const getAllUserAppointments = async (req: any, res: any) => {
  const currentUser = req.user

    try {
        const appointment = await AppointmentModel.find({
            $or: [
                {
                  doctorId: currentUser._id
                }
            ]
        })    
        .populate({
            path: "patientId",
            populate: {
                path: 'profileId',
                model: 'PatientProfile'
            }
        })
        clientResponse(res,200, {
            appointment:appointment
        })
    }  catch (error: typeof Error | any) {
        Logger.error(`${error.message}`)
    
        // return error
        clientResponse(res, 400, error.message)
      }
}

const respondToAppointment = async (req: any, res: any) => {
  const currentUser = req.user
  const appointmentId = req.params.id
  const { status, reason } = req.body

  console.log(`id === ${appointmentId}`)

  try {
    const appointment = await AppointmentModel.findByIdAndUpdate(appointmentId)

    if (appointment && status) {
      if (appointment.status == 'PENDING' || appointment.status == 'APPROVED') {
        if (status == 'CANCELLED') {
          appointment.status = status
          appointment.reasonForCancellation = reason
        } else {
          appointment.status = status
        }

        await appointment.save()
        clientResponse(res, 202, {
          appointment: appointment
        })
      } else {
        clientResponse(res, 400, {
          message: 'Appointment response cannot be modified after it is settled.',
          appointmentStatus: appointment.status
        })
      }
    }
  } catch (error: typeof Error | any) {
    Logger.error(`${error.message}`)

    // return error
    clientResponse(res, 400, error.message)
  }
}

const getUserTotalAppointments = async(req:any, res:any) => {
  const currentUser = req.user;

  try {
      const appointment = await AppointmentModel.find({
          $or: [
              {
                patientId: currentUser._id
              }
          ]
      })

      const length = appointment.length;
      clientResponse(res,200, {
          appointment:length
      })
  }  catch (error: typeof Error | any) {
      Logger.error(`${error.message}`)
  
      // return error
      clientResponse(res, 400, error.message)
    }
}

const getDoctorTotalAppointments = async(req:any, res:any) => {
  const currentUser = req.user;

  try {
      const appointment = await AppointmentModel.find({
          $or: [
              {
                doctorId: currentUser._id
              }
          ],
      })

      const length = appointment.length;
      clientResponse(res,200, {
          appointment:length
      })
  }  catch (error: typeof Error | any) {
      Logger.error(`${error.message}`)
  
      // return error
      clientResponse(res, 400, error.message)
    }
}


const getUserUpcomingAppointments = async(req:any, res:any) => {
 
  const currentUser = req.user;

  try {
      const appointment = await AppointmentModel.find({
          $or: [
              {
                patientId: currentUser._id
              }
          ]
      })    
      .populate({
          path: "doctorId",
          populate: {
              path: 'profileId',
              model: 'PractitionerProfile'
          }
      });

      const pendingAppointments = appointment.filter((appointment) => appointment.status === 'APPROVED' || appointment.status === 'PENDING');
      clientResponse(res,200, {
          appointment: pendingAppointments
      })
  }  catch (error: typeof Error | any) {
      Logger.error(`${error.message}`)
  
      // return error
      clientResponse(res, 400, error.message)
    }
}

const rescheduleAppointment = async (req: any, res: any) => {
  const currentUser = req.user
  const appointmentId = req.params.id
  const { appointmentDate } = req.body

  try {
    const isPatient: Boolean = currentUser.role === 'patient'
    if (!isPatient) {
      clientResponse(res, 400, {
        message: 'Only Patients can reschedule appointments.'
      })
    } else {
      const appointment = await AppointmentModel.findByIdAndUpdate(appointmentId)
      if (currentUser._id.toString() != appointment?.patientId.toString()) {
        clientResponse(res, 404, 'Patient Id does not match patient on appointment.')
      } else {
        if (appointment?.status == 'PENDING' || appointment?.status == 'APPROVED') {
          appointment.appointmentDate = appointmentDate
          const reschedule = await appointment.save()
          clientResponse(res, 202, {
            message: 'Appointment Rescheduled successfully!',
            rescheduleDate: reschedule.appointmentDate
          })
        } else {
          clientResponse(res, 400, {
            message: 'Appointment cannot be rescheduled after it is completed.',
            appointmentStatus: appointment?.status
          })
        }
      }
    }
  } catch (error: typeof Error | any) {
    Logger.error(`${error.message}`)
    // return error
    clientResponse(res, 400, error.message)
  }
}

const rateAppointment = async (req: any, res: any) => {
  const currentUser = req.user
  const appointmentId = req.params.id
  const { review, rating } = req.body

  try {
    const isPatient: Boolean = currentUser.role === 'patient'
    if (!isPatient) {
      clientResponse(res, 400, {
        message: 'Only Patients can share reviews appointments.'
      })
    }
    const appointment = await AppointmentModel.findByIdAndUpdate(appointmentId)

    if (appointment?.status === 'COMPLETED') {
      console.log(`${currentUser._id} -- ${appointment.patientId} `)
      if (appointment.patientId.toString() != currentUser._id.toString()) {
        clientResponse(res, 404, 'Patient Id does not match patient on appointment.')
      } else {
        appointment.review = review
        appointment.rating = rating

        const results = await appointment.save()

        const doctor = await practitionerProfile.findOneAndUpdate(appointment.doctorId)

        if (doctor) {
          if (appointment.review != null) {
            const updatedRating = (doctor.rating * doctor.noOfAppointments + rating) / (doctor.noOfAppointments + 1)

            doctor.rating = updatedRating

            const isreviewed = doctor.reviews.find((review) => review.reviewFrom === appointment.patientId)

            if (isreviewed) {
              doctor.reviews.push({
                review: appointment.review,
                rating: appointment.rating,
                reviewFrom: appointment.patientId
              })
            }

            await doctor.save()

            clientResponse(res, 201, {
              message: `You rated this appointment and  Doctor ${doctor.personalInfo?.firstName} ${doctor.personalInfo?.lastName} ${appointment.rating}.`
            })
          }
        }
      }
    } else {
      clientResponse(res, 400, {
        message: 'Invalid appointment Id Or appointment has not been completed.'
      })
    }
  } catch (error: typeof Error | any) {
    Logger.error(`${error.message}`)

    // return error
    clientResponse(res, 400, error.message)
  }
}



export { getAllGeneralPractitioners, getSpecialists, getDoctorProfile, createAppointment, getAllUserAppointments, respondToAppointment, rateAppointment,rescheduleAppointment, getUserTotalAppointments, getUserUpcomingAppointments, getDoctorTotalAppointments}
