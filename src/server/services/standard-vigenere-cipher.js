import { createRequire } from "module"
import { Buffer } from "node:buffer"
import moment from "moment"
import fs from "fs"
import os from "os"
import path from "path"
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const require = createRequire(import.meta.url)
const vigenere_cipher = require("./../../addons/vigenere-cipher/build/Release/vigenere_cipher.node")

export const encryptText = async (req, res, next) => {
    if (!req.body.text || !req.body.key) {
        res.status(400).send({
            message: "No plain text or key supplied!"
        })
        return
    }

    let text = req.body.text
    let key = req.body.key

    if (key.length > text.length) {
        res.status(400).send({
            message: "The key shall not exceed the text in length!"
        })
        return
    }

    const cipherText = vigenere_cipher.encrypt(text, key)

    if (req.query.out == "text") {
        await res.status(200).send({
            message: Buffer.from(cipherText).toString("base64")
        })
        return
    }
    if (req.query.out == "file") {
        const fileName = path.join(__dirname, "./../../../tmp", "ct-" + moment.now().toString() + ".txt")
        fs.writeFileSync(fileName, cipherText)
        res.attachment(fileName)
        await res.status(200).sendFile(fileName)
        // fs.unlinkSync(fileName)
        return
    }
}

export const encryptFile = async (req, res, next) => {
    if (!req.file || !req.body.key) {
        res.status(400).send({
            message: "No file or key supplied!"
        })
        return
    }
    // console.log("here")
    const readFile = fs.readFileSync(req.file.path)
    const toEncrypt = readFile.toString("utf-8")
    let key = req.body.key

    if (key.length > toEncrypt.length) {
        res.status(400).send({
            message: "The key shall not exceed the text in length!"
        })
        return
    }
    const encrypted = vigenere_cipher.encrypt(toEncrypt, key)
    
    const fileName = path.join(__dirname, "./../../../tmp", "ct-" + moment.now().toString() + ".txt")
    fs.writeFileSync(fileName, encrypted)
    await res.status(200).download(fileName)
}

export const decryptText = async (req, res, next) => {
    if (!req.body.text || !req.body.key) {
        res.status(400).send({
            message: "No cipher text or key supplied!"
        })
        return
    }

    let text = req.body.text
    let key = req.body.key

    if (key.length > text.length) {
        res.status(400).send({
            message: "The key shall not exceed the text in length!"
        })
        return
    }

    const plainText = vigenere_cipher.decrypt(text, key)

    if (req.query.out == "text") {
        await res.status(200).send({
            message: plainText
        })
        return
    }
    if (req.query.out == "file") {
        const fileName = path.join(__dirname, "./../../../tmp", "ct-" + moment.now().toString() + ".txt")
        fs.writeFileSync(fileName, plainText)
        await res.status(200).download(fileName)
        // fs.unlinkSync(fileName)
        return
    }
}

export const decryptFile = async (req, res, next) => {
    if (!req.file || !req.body.key) {
        res.status(400).send({
            message: "No file or key supplied!"
        })
        return
    }
    // console.log("here")
    const readFile = fs.readFileSync(req.file.path)
    const toDecrypt = readFile.toString("utf-8")
    let key = req.body.key

    if (key.length > toDecrypt.length) {
        res.status(400).send({
            message: "The key shall not exceed the text in length!"
        })
        return
    }
    const decrypted = vigenere_cipher.decrypt(toDecrypt, key)
    
    const fileName = path.join(__dirname, "./../../../tmp", "ct-" + moment.now().toString() + ".txt")
    fs.writeFileSync(fileName, decrypted)
    await res.status(200).download(fileName)
}