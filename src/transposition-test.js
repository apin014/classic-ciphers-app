import moment from "moment"
import { createRequire } from "module"
import { Buffer } from "node:buffer"

const require = createRequire(import.meta.url)
const transposition_cipher = require("./addons/transposition-cipher/build/Release/transposition_cipher")
const vigenere_cipher = require("./addons/vigenere-cipher/build/Release/vigenere_cipher")

let plaintext = `Nama saya Muhammad Davin Dzimar dari STI`
let v_key = "Ini kunci rahasia"
let t_key = 4

let v_cipherText = vigenere_cipher.encrypt(plaintext, v_key)
let t_cipherText = transposition_cipher.encrypt(v_cipherText, t_key)

let re_v_cipherText = transposition_cipher.decrypt(t_cipherText, t_key).slice(0, v_cipherText.length)
let re_plaintext = vigenere_cipher.decrypt(re_v_cipherText, v_key)

console.log(v_cipherText)
console.log(t_cipherText)
console.log(re_v_cipherText)
console.log(re_plaintext)

console.log(moment.now())