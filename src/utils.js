import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

import multer from "multer";

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, __dirname+"/public/img");
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    } 
});

export const uploader = multer({storage});

export const hashData = async (data) => {
    const hash = await bcrypt.hash(data, 10);
    return hash;
}

export const compareData = async (data, hashData) => {
    return bcrypt.compare(data, hashData);
}