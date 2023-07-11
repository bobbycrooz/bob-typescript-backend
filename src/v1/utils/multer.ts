import multer, { Multer } from 'multer';
import { Request } from 'express';
import path from "path";


export default  multer({
storage: multer.diskStorage({
    destination: function (req, file, cb) {
        // Specify the directory where you want to store the files
        cb(null, 'uploads/');
      },
}),
fileFilter: (req:any, file, cb) => {
    let ext = path.extname(file.originalname);  
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
    cb(Error("File type is not supported"));
    return;
    }
    cb(null, true);
},
})


