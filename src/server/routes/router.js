import express from "express"
import multer from "multer"
import moment from "moment"
import path from "path"
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import {
    doEncryptText as vigenereEncryptText, 
    doEncryptFile as vigenereEncryptFile, 
    doDecryptText as vigenereDecryptText,
    doDecryptFile as vigenereDecryptFile } from "../controllers/standard-vigenere-cipher.controller.js"

import {
    doEncryptText as playfairEncryptText, 
    doEncryptFile as playfairEncryptFile, 
    doDecryptText as playfairDecryptText,
    doDecryptFile as playfairDecryptFile } from "../controllers/playfair-cipher.controller.js"

import {
    doEncryptText as productEncryptText, 
    doEncryptFile as productEncryptFile, 
    doDecryptText as productDecryptText,
    doDecryptFile as productDecryptFile } from "../controllers/product-cipher.controller.js"

import {
    doEncryptText as extVigenereEncryptText, 
    doEncryptFile as extVigenereEncryptFile, 
    doDecryptText as extVigenereDecryptText,
    doDecryptFile as extVigenereDecryptFile } from "../controllers/extended-vigenere-cipher.controller.js"

export const appRouter = express.Router()

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
	  	cb(null, __dirname + "/./../../../tmp"); // Set the destination folder for uploaded files
	},
	filename: (req, file, cb) => {
	  	const ext = path.extname(file.originalname);
	  	cb(null, moment.now().toString() + ext); // Set the file name to be unique (timestamp + extension)
	},
  });
  
const upload = multer({ storage: storage });

appRouter.post("/vigenere/standard/text", (req, res, next) => {
    if (req.query.flavor == "encrypt") {
        vigenereEncryptText(req, res, next)
        return
    }
    if (req.query.flavor == "decrypt") {
        // console.log(req)
        vigenereDecryptText(req, res, next)
        return
    }
})

appRouter.post("/vigenere/standard/file", upload.single("uploadField"), (req, res, next) => {
    // console.log(req)
    if (req.query.flavor == "encrypt") {
        vigenereEncryptFile(req, res, next)
    }
    if (req.query.flavor == "decrypt") {
        vigenereDecryptFile(req, res, next)
    }
})

appRouter.post("/vigenere/extended/text", (req, res, next) => {
    if (req.query.flavor == "encrypt") {
        extVigenereEncryptText(req, res, next)
        return
    }
    if (req.query.flavor == "decrypt") {
        // console.log(req)
        extVigenereDecryptText(req, res, next)
        return
    }
})

appRouter.post("/vigenere/extended/file", upload.single("uploadField"), (req, res, next) => {
    // console.log(req)
    if (req.query.flavor == "encrypt") {
        extVigenereEncryptFile(req, res, next)
    }
    if (req.query.flavor == "decrypt") {
        extVigenereDecryptFile(req, res, next)
    }
})

appRouter.post("/playfair/text", (req, res, next) => {
    if (req.query.flavor == "encrypt") {
        playfairEncryptText(req, res, next)
        return
    }
    if (req.query.flavor == "decrypt") {
        // console.log(req)
        playfairDecryptText(req, res, next)
        return
    }
})

appRouter.post("/playfair/file", upload.single("uploadField"), (req, res, next) => {
    // console.log(req)
    if (req.query.flavor == "encrypt") {
        playfairEncryptFile(req, res, next)
    }
    if (req.query.flavor == "decrypt") {
        playfairDecryptFile(req, res, next)
    }
})

appRouter.post("/product/text", (req, res, next) => {
    if (req.query.flavor == "encrypt") {
        productEncryptText(req, res, next)
        return
    }
    if (req.query.flavor == "decrypt") {
        // console.log(req)
        productDecryptText(req, res, next)
        return
    }
})

appRouter.post("/product/file", upload.single("uploadField"), (req, res, next) => {
    // console.log(req)
    if (req.query.flavor == "encrypt") {
        productEncryptFile(req, res, next)
    }
    if (req.query.flavor == "decrypt") {
        productDecryptFile(req, res, next)
    }
})