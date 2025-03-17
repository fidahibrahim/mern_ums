import multer from "multer";
import path from 'path'
import fs from 'fs'

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});

const fileFilter = (req,file,cb) => {
    if(!file.mimetype.startsWith('image')){
        return cb(new Error('Only images are allowed'))
    }
    cb(null, true)
}

const fileSizeLimit = 5 * 1024 * 1024

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: fileSizeLimit }
})

export default upload