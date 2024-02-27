{
    "targets": [
        {
            "target_name": "extended_vigenere_cipher",
            "sources": [ "./extended-vigenere-cipher.cpp", "./../include/lookupAlphabet.cpp", "./../include/lookupAlphabet.hpp" ],
            "include_dirs": [
                "<!(node -e \"require('nan')\")",
                "./../include/"
            ],
            "cflags!": ["-fno-exceptions"],
            "cflags_cc!": ["-fno-exceptions"],
        }
    ]
}