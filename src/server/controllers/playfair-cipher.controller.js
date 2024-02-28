import { encryptText, encryptFile, decryptText, decryptFile } from "../services/playfair-cipher.js"
import multer from "multer"
import moment from "moment"
import path from "path"
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
	  	cb(null, __dirname + "/./../../../tmp"); // Set the destination folder for uploaded files
	},
	filename: (req, file, cb) => {
	  	const ext = path.extname(file.originalname);
	  	cb(null, moment.now().toString() + ext); // Set the file name to be unique (timestamp + extension)
	},
  });
  
export const upload = multer({ storage: storage });

export const doEncryptText = async (req, res, next) => {
	encryptText(req, res, next)
}

export const doEncryptFile = async (req, res, next) => {
  	encryptFile(req, res, next);
}

export const doDecryptText = async (req, res, next) => {
	decryptText(req, res, next)
}

export const doDecryptFile = async (req, res, next) => {
	decryptFile(req, res, next)
}