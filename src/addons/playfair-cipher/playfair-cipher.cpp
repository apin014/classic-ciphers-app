#include <nan.h>
#include <unordered_map>
#include <map>
#include "./../include/lookupAlphabet.hpp"

bool isJ(char c) {return c == 'j';}

void createLookup(std::map<char, int> &letterToIndex, std::unordered_map<int, char> &indexToLetter);
void bigramArrange(std::string &text);
void matrixOp(int mode, char keyMatrix[5][5], std::string plainText, std::string &cipherText);

NAN_METHOD(encrypt)
{
    if (info.Length() < 2)
    {
        Nan::ThrowTypeError("Wrong number of arguments");
        return;
    }

    if (!info[0]->IsString())
    {
        Nan::ThrowTypeError("The first argument should be a String");
        return;
    }

    if (!info[1]->IsString())
    {
        Nan::ThrowTypeError("The second argument should be a String");
        return;
    }

    Nan::Utf8String plainText(info[0]);
    Nan::Utf8String key(info[1]);

    std::string cpp_plainText(*plainText);
    std::string cpp_key(*key);

    std::transform(cpp_plainText.begin(), cpp_plainText.end(), cpp_plainText.begin(), ::tolower);
    std::transform(cpp_key.begin(), cpp_key.end(), cpp_key.begin(), ::tolower);

    cpp_plainText.erase(std::remove_if(cpp_plainText.begin(), cpp_plainText.end(), ::isspace), cpp_plainText.end());
    std::replace(cpp_plainText.begin(), cpp_plainText.end(), 'j', 'i');

    cpp_key.erase(std::remove_if(cpp_key.begin(), cpp_key.end(), ::isspace), cpp_key.end());
    // cpp_key.erase(std::remove_if(cpp_key.begin(), cpp_key.end(), isJ), cpp_key.end());
    std::replace(cpp_key.begin(), cpp_key.end(), 'j', 'i');

    std::unordered_map<char, int> exists;
    std::unordered_map<char, int> letterToIndex;
    std::unordered_map<int, char> indexToLetter;

    createLookup(letterToIndex, indexToLetter);
    std::string cpp_key_ = "";

    for (int i = 0; i < cpp_key.size(); i++) {
        if (exists.find(cpp_key.at(i)) == exists.end()) {
            cpp_key_.push_back(cpp_key.at(i));
            exists[cpp_key.at(i)]++;
        }
    }

    for (int i = 0; i < indexToLetter.size(); i++) {
        if (exists.find(indexToLetter[i]) == exists.end() && indexToLetter[i] != 'j') {
            cpp_key_.push_back(indexToLetter[i]);
            exists[indexToLetter[i]]++;
        }
    }

    int i = 0;
    char keyMatrix[5][5];
    for (int row = 0; row < 5; row++) {
        for (int col = 0; col < 5; col++) {
            keyMatrix[row][col] = cpp_key_.at(i);
            i++;
        }
    }
    bigramArrange(cpp_plainText);
    std::string cpp_cipherText;

    matrixOp(0, keyMatrix, cpp_plainText, cpp_cipherText);

    v8::Local<v8::String> res = Nan::New(cpp_cipherText).ToLocalChecked();

    info.GetReturnValue().Set(res);
}

NAN_METHOD(decrypt)
{
    if (info.Length() < 2)
    {
        Nan::ThrowTypeError("Wrong number of arguments");
        return;
    }

    if (!info[0]->IsString())
    {
        Nan::ThrowTypeError("The first argument should be a String");
        return;
    }

    if (!info[1]->IsString())
    {
        Nan::ThrowTypeError("The second argument should be a String");
    }

    Nan::Utf8String cipherText(info[0]);
    Nan::Utf8String key(info[1]);

    std::string cpp_cipherText(*cipherText);
    std::string cpp_key(*key);

    std::transform(cpp_cipherText.begin(), cpp_cipherText.end(), cpp_cipherText.begin(), ::tolower);
    std::transform(cpp_key.begin(), cpp_key.end(), cpp_key.begin(), ::tolower);

    cpp_cipherText.erase(std::remove_if(cpp_cipherText.begin(), cpp_cipherText.end(), ::isspace), cpp_cipherText.end());
    cpp_key.erase(std::remove_if(cpp_key.begin(), cpp_key.end(), ::isspace), cpp_key.end());

    // cpp_key.erase(std::remove_if(cpp_key.begin(), cpp_key.end(), isJ), cpp_key.end());
    std::replace(cpp_key.begin(), cpp_key.end(), 'j', 'i');

    std::unordered_map<char, int> exists;
    std::unordered_map<char, int> letterToIndex;
    std::unordered_map<int, char> indexToLetter;

    createLookup(letterToIndex, indexToLetter);
    std::string cpp_key_ = "";

    for (int i = 0; i < cpp_key.size(); i++) {
        if (exists.find(cpp_key.at(i)) == exists.end()) {
            cpp_key_.push_back(cpp_key.at(i));
            exists[cpp_key.at(i)]++;
        }
    }

    for (int i = 0; i < indexToLetter.size(); i++) {
        if (exists.find(indexToLetter[i]) == exists.end() && indexToLetter[i] != 'j') {
            cpp_key_.push_back(indexToLetter[i]);
            exists[indexToLetter[i]]++;
        }
    }

    int i = 0;
    char keyMatrix[5][5];
    for (int row = 0; row < 5; row++) {
        for (int col = 0; col < 5; col++) {
            keyMatrix[row][col] = cpp_key_.at(i);
            i++;
        }
    }

    std::string cpp_plainText;

    matrixOp(1, keyMatrix, cpp_cipherText, cpp_plainText);

    v8::Local<v8::String> res = Nan::New(cpp_plainText).ToLocalChecked();

    info.GetReturnValue().Set(res);
}

void bigramArrange(std::string &text)
{
    std::string::iterator it = text.begin();
    while (it != text.end()) {
        if (it+1 == text.end()) {
            if ((text.size() % 2) != 0) {
                text.push_back('x');
            }
            break;
        }
        if (*it == *(it+1)) {
            text.insert(it+1, 'x');
        }
        it++;
    }
}

void matrixOp(int mode, char keyMatrix[5][5], std::string plainText, std::string &cipherText)
{
    if (mode == 0) {
        for (int i = 0; i < plainText.size(); i+=2) {
            int pos[4];
            for (int row = 0; row < 5; row++) {
                for (int col = 0; col < 5; col++) {
                    int a, b;
                    if (keyMatrix[row][col] == plainText.at(i)) {
                        pos[0] = row;
                        pos[1] = col;
                    } else if (keyMatrix[row][col] == plainText.at(i+1)) {
                        pos[2] = row;
                        pos[3] = col;
                    }
                }
            }
            if (pos[0] == pos[2]) {
                cipherText.push_back(keyMatrix[pos[0]][(pos[1] + 1) % 5]);
                cipherText.push_back(keyMatrix[pos[0]][(pos[3] + 1) % 5]);
            } else if (pos[1] == pos[3]) {
                cipherText.push_back(keyMatrix[(pos[0] + 1) % 5][pos[1]]);
                cipherText.push_back(keyMatrix[(pos[2] + 1) % 5][pos[1]]);
            } else {
                cipherText.push_back(keyMatrix[pos[0]][pos[3]]);
                cipherText.push_back(keyMatrix[pos[2]][pos[1]]);
            }
        }
    } else if (mode == 1) {
        for (int i = 0; i < plainText.size(); i+=2) {
            int pos[4];
            for (int row = 0; row < 5; row++) {
                for (int col = 0; col < 5; col++) {
                    int a, b;
                    if (keyMatrix[row][col] == plainText.at(i)) {
                        pos[0] = row;
                        pos[1] = col;
                    } else if (keyMatrix[row][col] == plainText.at(i+1)) {
                        pos[2] = row;
                        pos[3] = col;
                    }
                }
            }
            if (pos[0] == pos[2]) {
                cipherText.push_back(keyMatrix[pos[0]][(pos[1] - 1 + 5) % 5]);
                cipherText.push_back(keyMatrix[pos[0]][(pos[3] - 1 + 5) % 5]);
            } else if (pos[1] == pos[3]) {
                cipherText.push_back(keyMatrix[(pos[0] - 1 + 5) % 5][pos[1]]);
                cipherText.push_back(keyMatrix[(pos[2] - 1 + 5) % 5][pos[1]]);
            } else {
                cipherText.push_back(keyMatrix[pos[0]][pos[3]]);
                cipherText.push_back(keyMatrix[pos[2]][pos[1]]);
            }
        }
    }
    
}


NAN_MODULE_INIT(Init)
{
    Nan::Set(target, Nan::New("encrypt").ToLocalChecked(), 
        Nan::GetFunction(Nan::New<v8::FunctionTemplate>(encrypt)).ToLocalChecked());

    Nan::Set(target, Nan::New("decrypt").ToLocalChecked(), 
        Nan::GetFunction(Nan::New<v8::FunctionTemplate>(decrypt)).ToLocalChecked());
}

NODE_MODULE(playfair_cipher, Init)