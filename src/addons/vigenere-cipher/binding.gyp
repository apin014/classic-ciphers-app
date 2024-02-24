{
    "targets": [
        {
            "target_name": "vigenere_cipher",
            "sources": [ "./vigenere-cipher.cpp", "./../include/lookupAlphabet.cpp", "./../include/lookupAlphabet.hpp" ],
            "include_dirs": [
                "<!(node -e \"require('nan')\")",
                "./../include/"
            ],
            "cflags!": ["-fno-exceptions"],
            "cflags_cc!": ["-fno-exceptions"],
        }
    ]
}