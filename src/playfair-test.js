import moment from "moment"
import { createRequire } from "module"

const require = createRequire(import.meta.url)
const playfair_cipher = require("./addons/playfair-cipher/build/Release/playfair_cipher")

let plaintext = `temui ibu nanti malam`
let key = "jalan ganesha sepuluh"
let ciphertext = playfair_cipher.encrypt(plaintext, key)
let re_plaintext = playfair_cipher.decrypt(ciphertext, key);

console.log(plaintext.length)
console.log(ciphertext)
console.log(ciphertext.length)
console.log(re_plaintext)
console.log(re_plaintext.length)

console.log(moment.now())