import User from '../user/user.model'
import AppointmentModel from './appointment.model'
import { practitionerProfile, patientProfile } from '../user/user.model'
import Services from '../../helpers/model.helper'
import { clientResponse } from '../../helpers/response'
import Logger from '../../iibs/logger'
import { appointmentValidationSchema } from '../../utils/validation/appointmentValidation'
import { generateMeetingLink } from "../../helpers/googleMeet";

const userService = new Services(User)
const appointmentService = new Services(AppointmentModel)


const getAllGeneralPractitioners = async(req:any, res: any) => {
    try {
        const allDoctors = await practitionerProfile.find();

        clientResponse(res,200, {
            allDoctors: allDoctors
        })
    } catch (error: typeof Error | any) {
        Logger.error(`${error.message}`)
    
        // return error
        clientResponse(res, 400, error.message)
      }
}

const getSpecialists = async (req:any, res:any) => {
    const { specialty } = req.body;

    try {

        const allSpecialists = await practitionerProfile.find({'medicalInfo.specialty': specialty });

        clientResponse(res,200, {
            allSpecialists: allSpecialists
        })
    } catch (error: typeof Error | any) {
        Logger.error(`${error.message}`)
    
        // return error
        clientResponse(res, 400, error.message)
      }
}


const getDoctorProfile = async( req:any, res: any) => {
    const id = req.params.id

    try {
        const doctor = await practitionerProfile.findOne({_id:id});

        if (doctor) {
            return clientResponse(res,200, {
                doctor: doctor
            })
        }
            
    
    } catch (error: typeof Error | any) {
        Logger.error(`${error.message}`)
    
        // return error
        clientResponse(res, 400, error.message)
      }
}


const createAppointment =async (req:any, res:any) => {
    
    try {
        const currentUser = req.user;

        const isPatient = currentUser.role === 'patient';
        const appointmentData = req.body;

         console.log(appointmentData);

         if (isPatient && !appointmentData.doctorId) {
            return clientResponse(res,400, {
                message: `Provide the doctor Id you are creating an appointment.`
            })
         }

         const value = await appointmentValidationSchema.validateAsync(appointmentData);

         console.log(value);

         const meetingLink = generateMeetingLink();


         const appointment = new AppointmentModel({
            ...appointmentData,
            patientId: appointmentData.patientId || currentUser.id,
            meetingLink: meetingLink
          });

         const result =  await appointment.save();


         const doctorId = result.doctorId;

         console.log(`docotr: ${doctorId}`);
         


         if (appointment) {

           const doctor =  await User.findOne({_id: doctorId});
           if (doctor) {
            const doctorProfile = await practitionerProfile.findByIdAndUpdate(doctor.profileId,{ $inc: { noOfAppointments: 1 } });

            await doctorProfile?.save();
            clientResponse(res, 201, {
                appointment:appointment,
                doctor: doctorProfile
            }
            )
           }

         }
         
    
    } catch (error: typeof Error | any) {
        Logger.error(`${error.message}`)
    
        // return error
        clientResponse(res, 400, error.message)
      }
}

const getAllUserAppointments = async(req:any, res:any) => {

    const currentUser = req.user;

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

const respondToAppointment = async (req:any, res:any) => {
    const currentUser = req.user;
    const appointmentId = req.params.id;
    const { status, reason } = req.body;

    console.log(`id === ${appointmentId}`);
    

    try {
        const appointment = await AppointmentModel.findByIdAndUpdate(appointmentId)

        if (appointment && status) {
            if (appointment.status == "PENDING" || appointment.status == "APPROVED") {
                if (status == "CANCELLED") {
                    appointment.status = status
                    appointment.reasonForCancellation = reason
                }else{
                    appointment.status = status;
                }
               
            }

            else{
                clientResponse(res,400, {
                    message: "Appointment response cannot be modified after it is settled.",
                    appointmentStatus: appointment.status
                })
            }

            
            await appointment.save()
           clientResponse(res,202, {
          appointment:appointment
           })
        }
    } catch (error: typeof Error | any) {
        Logger.error(`${error.message}`)
    
        // return error
        clientResponse(res, 400, error.message)
      }
}

const rateAppointment = async (req:any, res:any) => {
    const currentUser = req.user;
    const appointmentId = req.params.id;
    const { review , rating} = req.body;

    try {
        const appointment = await AppointmentModel.findByIdAndUpdate(appointmentId);

        if (appointment) {
            console.log(`${currentUser._id} -- ${appointment.patientId} `);
            if (appointment.patientId.toString() != currentUser._id.toString()) {
                clientResponse(res,404, "Patient Id does not match patient on appointment.")
            }else{
                appointment.review = review;
                appointment.rating = rating;

               const results =  await appointment.save();

               const doctor = await practitionerProfile.findOneAndUpdate(appointment.doctorId);

               if (doctor) {

                const updatedRating =
                (doctor.rating * 6 + rating) / (6 + 1);

                console.log(updatedRating);
                console.log(doctor.noOfAppointments);
      
      


                doctor.rating = updatedRating;

                await doctor.save()

                clientResponse(res,201, {
                    results:results, 
                    doctor: doctor,
                    appointment: doctor.noOfAppointments
                   })
               }

            
           


               

            }

        }else{
            clientResponse(res,201, {
                message: "invalid appointment Id"
            })
        }

        

    } catch (error: typeof Error | any) {
        Logger.error(`${error.message}`)
    
        // return error
        clientResponse(res, 400, error.message)
      }
}






export { getAllGeneralPractitioners, getSpecialists, getDoctorProfile, createAppointment, getAllUserAppointments, respondToAppointment, rateAppointment}