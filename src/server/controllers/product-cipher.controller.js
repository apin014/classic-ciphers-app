import { encryptText, encryptFile, decryptText, decryptFile } from "../services/product-cipher.js"
import multer from "multer"
import moment from "moment"
import path from "path"
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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