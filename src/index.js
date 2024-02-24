import moment from "moment"
import { createRequire } from "module"

const require = createRequire(import.meta.url)
const vigenere_cipher = require("./addons/vigenere-cipher/build/Release/vigenere_cipher")

console.log(moment.now())

let plaintext = `this plain text`
let key = "sony"
let ciphertext = vigenere_cipher.encrypt(plaintext, key)
const re_plaintext = vigenere_cipher.decrypt(ciphertext, key)

console.log(key)
console.log(ciphertext)
console.log(re_plaintext)
