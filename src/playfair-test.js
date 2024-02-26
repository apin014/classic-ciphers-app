import moment from "moment"
import { createRequire } from "module"
import { Buffer } from "node:buffer"

const require = createRequire(import.meta.url)
const playfair_cipher = require("./addons/playfair-cipher/build/Release/playfair_cipher")

let plaintext = `temui ibu nanti malam`
let key = "jalan ganesha sepuluh"
let ciphertext = playfair_cipher.encrypt(plaintext, key)
let re_plaintext = playfair_cipher.decrypt(ciphertext, key);

console.log(Buffer.from(ciphertext).toString("base64"))
console.log(re_plaintext)

console.log(moment.now())