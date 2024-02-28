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
const transposition_cipher = require("./../../addons/transposition-cipher/build/Release/transposition_cipher.node")

export const encryptText = async (req, res, next) => {
    if (!req.body.plainText || !req.body.key || !req.body.lKey) {
        res.status(400).send({
            message: "No plain text or key supplied!"
        })
        return
    }

    let text = req.body.plainText
    let key = req.body.key
    let lKey = req.body.lKey

    if (key.length > text.length || lKey > text.length) {
        res.status(400).send({
            message: "The key shall not exceed the text in length!"
        })
        return
    }

    const cipherText = vigenere_cipher.encrypt(text, key)
    const transposed = transposition_cipher.encrypt(cipherText, lKey)

    if (req.query.out == "text") {
        await res.status(200).send({
            message: Buffer.from(transposed).toString("base64")
        })
        return
    }
    if (req.query.out == "file") {
        const fileName = path.join(__dirname, "./../../../tmp", "ct-" + moment.now().toString())
        fs.writeFileSync(fileName, transposed)
        await res.status(200).download(fileName)
        // fs.unlinkSync(fileName)
        return
    }
}

export const encryptFile = async (req, res, next) => {
    if (!req.file || !req.body.key || !req.body.lKey) {
        res.status(400).send({
            message: "No file or key supplied!"
        })
        return
    }
    // console.log("here")
    const readFile = fs.readFileSync(req.file.path)
    const toEncrypt = readFile.toString("utf-8")
    let key = req.body.key
    let lKey = parseInt(req.body.lKey)

    if (key.length > toEncrypt.length || lKey > toEncrypt.length) {
        res.status(400).send({
            message: "The key shall not exceed the text in length!"
        })
        return
    }
    const encrypted = vigenere_cipher.encrypt(toEncrypt, key)
    const transposed = transposition_cipher.encrypt(encrypted, lKey)
    
    const fileName = path.join(__dirname, "./../../../tmp", "ct-" + moment.now().toString())
    fs.writeFileSync(fileName, transposed)
    await res.status(200).download(fileName)
}

export const decryptText = async (req, res, next) => {
    if (!req.body.cipherText || !req.body.key || !req.body.lKey) {
        res.status(400).send({
            message: "No cipher text or key supplied!"
        })
        return
    }

    let text = req.body.cipherText
    let key = req.body.key
    let lKey = req.body.lKey

    if (key.length > text.length || lKey > text.length) {
        res.status(400).send({
            message: "The key shall not exceed the text in length!"
        })
        return
    }

    const reTransposed = transposition_cipher.decrypt(text, lKey)
    const plainText = vigenere_cipher.decrypt(reTransposed, key)

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
    if (!req.file || !req.body.key || !req.body.lKey) {
        res.status(400).send({
            message: "No file or key supplied!"
        })
        return
    }
    // console.log("here")
    const readFile = fs.readFileSync(req.file.path)
    const toDecrypt = readFile.toString("utf-8")
    let key = req.body.key
    let lKey = parseInt(req.body.lKey)

    if (key.length > toDecrypt.length || lKey > toDecrypt.length) {
        res.status(400).send({
            message: "The key shall not exceed the text in length!"
        })
        return
    }
    const reTransposed = transposition_cipher.decrypt(toDecrypt, lKey)
    const decrypted = vigenere_cipher.decrypt(reTransposed, key)
    
    const fileName = path.join(__dirname, "./../../../tmp", "ct-" + moment.now().toString() + ".txt")
    fs.writeFileSync(fileName, decrypted)
    await res.status(200).download(fileName)
}