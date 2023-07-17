import upload from '../../utils/multer';
import { clientResponse } from '../../helpers/response';
import cloudinary from '../../utils/cloudinary';
import fs from 'fs';
import Logger from '../../libs/logger';


const uploadImage = async(req:any, res: any) => {
    try {
        if (!req.files || req.files.length === 0) {
            clientResponse(res,400, {
                message: "No image selected"
            })
          }
      
          const uploadedImages = [];
      
          for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
      
            // Upload image to Cloudinary
            const result = await cloudinary.uploader.upload(file.path);
      
            // Add uploaded image to the array with its index
            uploadedImages.push({ index: i, url: result.secure_url });
      
            // Delete the local file after uploading
            fs.unlinkSync(file.path);
          }

          return clientResponse(res,201, {
            status: 201,
            success: true,
            imagesStatus: true,
            message: "Images saved succesfully",
            data:{
                uploadedImages
            }

          })

    } catch (error: typeof Error | any) {
        Logger.error(`${error.message}`)

        // return error
        clientResponse(res, 400, error.message)
        }
}

export { uploadImage };