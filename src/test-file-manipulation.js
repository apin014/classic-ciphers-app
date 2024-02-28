import fs from "fs"
import os from "os"
import path from "path"
import { exec } from "child_process"
import { fileURLToPath } from 'url'
import { Buffer } from "node:buffer"
import { createRequire } from "module"
import dotenv from "dotenv"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({path: __dirname + "/./../.env"})

const require = createRequire(import.meta.url)
const extended_vigenere_cipher = require("./addons/extended-vigenere-cipher/build/Release/extended_vigenere_cipher")

const key = "12345"
const signature = process.env.SIGNATURE || "SIG"

// ENCRYPTION
// const filePath = path.join(__dirname, "..", "pog.jpeg")
// const readFile = fs.readFileSync(filePath)
// const ext = path.extname(filePath)

// const meta = signature + ext.length.toString() + ext

// const metaBuf = Buffer.from(meta)

// const bufArr = [metaBuf, readFile]

// const toEncrypt = Uint8Array.from(Buffer.concat(bufArr))

// const encrypted = extended_vigenere_cipher.encrypt(toEncrypt, toEncrypt.length, key)

// console.log(Uint8Array.from(encrypted))

// const writePath = path.join(__dirname, "..", "pog(encrypted)")
// fs.writeFileSync(writePath, encrypted)

// if (os.platform() === 'win32') {
//     exec(`attrib +r ${writePath}`, (error, stdout, stderr) => {
//       if (error) {
//         console.log(`Error: ${error.message}`);
//         return;
//       }
//       if (stderr) {
//         console.log(`Stderr: ${stderr}`);
//         return;
//       }
//       console.log(`Stdout: ${stdout}`);
//     });
//   } else {
//     fs.chmodSync(writePath, '444');
//   }

// DECRYPTION
const filePath = path.join(__dirname, "..", "pog(encrypted)")
const readFile = fs.readFileSync(filePath)

let decrypted = extended_vigenere_cipher.decrypt(Uint8Array.from(readFile), Uint8Array.from(readFile).length, key)
let sFile = decrypted.toString()

if (sFile.slice(0, signature.length) !== signature) {
    console.error("[Error] This file was not encrypted using this program and cannot be decrypted!")
    process.exit(9)
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
console.log(decrypted.length)

fs.writeFileSync(`pog(decrypted)${ext}`, decrypted)