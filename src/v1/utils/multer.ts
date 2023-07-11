// @ts-ignore
import multer, { Multer } from 'multer';
import { Request } from 'express';
import path from "path";


export default  multer({
storage: multer.diskStorage({
    destination: function (req: any, file: any, cb: (arg0: null, arg1: string) => void) {
        // Specify the directory where you want to store the files
        cb(null, 'uploads/');
      },
}),
    // @ts-ignore
fileFilter: (req:any, file: { originalname: string; }, cb: (arg0: Error | null, arg1: boolean | undefined) => void) => {
    let ext = path.extname(file.originalname);  
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png")
    {
        // @ts-ignore
    cb(Error("File type is not supported"));
    return;
    }
    cb(null, true);
},
})


