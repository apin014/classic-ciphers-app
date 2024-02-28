import moment from "moment"
import { createRequire } from "module"
import { Buffer } from "node:buffer"

const require = createRequire(import.meta.url)
const vigenere_cipher = require("./addons/vigenere-cipher/build/Release/vigenere_cipher")

console.log(moment.now())

let plaintext = `this plain text`
let key = "sony"
let ciphertext = vigenere_cipher.encrypt(plaintext, key)
const re_plaintext = vigenere_cipher.decrypt(ciphertext, key)
const cipher64 = Buffer.from(ciphertext).toString("base64")

console.log(key)
console.log(cipher64)
console.log(Buffer.from(cipher64, "base64").toString("utf-8"))
console.log(re_plaintext)
