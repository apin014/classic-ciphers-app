cmd_Release/transposition_cipher.node := ln -f "Release/obj.target/transposition_cipher.node" "Release/transposition_cipher.node" 2>/dev/null || (rm -rf "Release/transposition_cipher.node" && cp -af "Release/obj.target/transposition_cipher.node" "Release/transposition_cipher.node")