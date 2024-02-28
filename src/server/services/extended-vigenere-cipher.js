import { createRequire } from "module"
import { Buffer } from "node:buffer"
import moment from "moment"
import fs from "fs"
import os from "os"
import { exec } from "child_process"
import path from "path"
import { fileURLToPath } from 'url'
import dotenv from "dotenv"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({path: __dirname + "/./../../../.env"})

const require = createRequire(import.meta.url)
const extended_vigenere_cipher = require("./../../addons/extended-vigenere-cipher/build/Release/extended_vigenere_cipher.node")
const signature = process.env.signature || "SIG"

export const encryptText = async (req, res, next) => {
    if (!req.body.plainText || !req.body.key) {
        res.status(400).send({
            message: "No plain text or key supplied!"
        })
        return
    }

    let text = Buffer.from(req.body.plainText)
    let key = req.body.key

    if (key.length > text.length) {
        res.status(400).send({
            message: "The key shall not exceed the text in length!"
        })
        return
    }

    if (req.query.out == "text") {
        const cipherText = extended_vigenere_cipher.encrypt(Uint8Array.from(text), Uint8Array.from(text).length, key)
        await res.status(200).send({
            message: Buffer.from(cipherText).toString("base64")
        })
        return
    }
    if (req.query.out == "file") {
        const fileName = path.join(__dirname, "./../../../tmp", "ct-" + moment.now().toString())
        const ext = path.extname(fileName)
        const meta = signature + ext.length.toString() + ext
        const metaBuf = Buffer.from(meta)
        const bufArr = [metaBuf, text]
        const toEncrypt = Uint8Array.from(Buffer.concat(bufArr))

        const encrypted = extended_vigenere_cipher.encrypt(toEncrypt, toEncrypt.length, key)

        fs.writeFileSync(fileName, encrypted)
        if (os.platform() === 'win32') {
            exec(`attrib +r ${fileName}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`Stderr: ${stderr}`);
                return;
            }
            console.log(`Stdout: ${stdout}`);
            });
        } else {
            fs.chmodSync(fileName, '444');
        }
        await res.status(200).download(fileName)
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
    const readFile = fs.readFileSync(req.file.path)
    const ext = path.extname(req.file.path)
    const meta = signature + ext.length.toString() + ext
    const metaBuf = Buffer.from(meta)
    const bufArr = [metaBuf, readFile]
    const toEncrypt = Uint8Array.from(Buffer.concat(bufArr))

    // const toEncrypt = readFile.toString("utf-8")
    let key = req.body.key

    if (key.length > toEncrypt.length) {
        res.status(400).send({
            message: "The key shall not exceed the text in length!"
        })
        return
    }
    const encrypted = extended_vigenere_cipher.encrypt(toEncrypt, toEncrypt.length, key)
    
    const fileName = path.join(__dirname, "./../../../tmp", "ct-" + moment.now().toString())
    fs.writeFileSync(fileName, encrypted)
    if (os.platform() === 'win32') {
        exec(`attrib +r ${fileName}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`Stderr: ${stderr}`);
            return;
        }
        console.log(`Stdout: ${stdout}`);
        });
    } else {
        fs.chmodSync(fileName, '444');
    }
    await res.status(200).download(fileName)
}

export const decryptText = async (req, res, next) => {
    if (!req.body.cipherText || !req.body.key) {
        res.status(400).send({
            message: "No cipher text or key supplied!"
        })
        return
    }

    // let text = Buffer.from(req.body.cipherText, "base64").toString("utf-8")
    let text = Buffer.from(req.body.cipherText)
    let key = req.body.key

    if (key.length > text.length) {
        res.status(400).send({
            message: "The key shall not exceed the text in length!"
        })
        return
    }

    const plainText = extended_vigenere_cipher.decrypt(Uint8Array.from(text), Uint8Array.from(text).length, key)

    if (req.query.out == "text") {
        await res.status(200).send({
            message: Buffer.from(plainText).toString()
        })
        return
    }
    if (req.query.out == "file") {
        const fileName = path.join(__dirname, "./../../../tmp", "ct-" + moment.now().toString())
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
    const toDecrypt = Uint8Array.from(readFile)
    let key = req.body.key

    if (key.length > toDecrypt.length) {
        res.status(400).send({
            message: "The key shall not exceed the text in length!"
        })
        return
    }
    let decrypted = extended_vigenere_cipher.decrypt(toDecrypt, toDecrypt.length, key)
    let sFile = decrypted.toString()

    if (sFile.slice(0, signature.length) !== signature) {
        res.status(400).send({
            message: "[Error] This file was not encrypted using this program and cannot be decrypted!"
        })
        return
    }
    
    sFile = sFile.slice(signature.length)
    
    let sLen = sFile[0]
    const num = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
    for (let i = 1; ;i++) {
        if (num.includes(sFile[i])) {
            sLen += (sFile[i])
            sFile.slice(i++)
        } else {
            break
        }
    }
    
    let ext = ""
    
    for (let i = sLen.length; i <= parseInt(sLen); i++) {
        ext += (sFile[i])
    }
    
    decrypted = decrypted.slice(signature.length + sLen.length + parseInt(sLen))
    
    const fileName = path.join(__dirname, "./../../../tmp", "ct-" + moment.now().toString() + ext)
    fs.writeFileSync(fileName, decrypted)
    await res.status(200).download(fileName)
}