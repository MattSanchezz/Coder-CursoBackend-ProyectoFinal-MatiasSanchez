import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

const documentStorage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, `${__dirname}/uploads/documents`);
  },
  filename: function(req, file, cb){
    cb(null, file.originalname);
  } 
});

const profileStorage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, `${__dirname}/uploads/profiles`);
  },
  filename: function(req, file, cb){
    cb(null, file.originalname);
  } 
});

const productStorage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, `${__dirname}/uploads/products`);
  },
  filename: function(req, file, cb){
    cb(null, file.originalname);
  } 
});

export const uploadDocument = multer({ storage: documentStorage });

export const uploaderProfile = multer({ storage: profileStorage });

export const uploaderProduct = multer({ storage: productStorage });

export const uploader = (uploads) => {
    return multer({
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, `${__dirname}/public/${uploads}`);
        },
        filename: function (req, file, cb) {
          cb(null, file.originalname);
        },
      }),
    });
  };

export const hashData = async (data) => {
  const hash = await bcrypt.hash(data, 10);
  return hash;
}

export const compareData = async (data, hashData) => {
  return bcrypt.compare(data, hashData);
}