#include <nan.h>
#include <map>
#include "./../include/lookupAlphabet.hpp"

void createLookup(std::map<char, int> &letterToIndex, std::unordered_map<int, char> &indexToLetter);
// int convertLetter(char letter, std::unordered_map<char, int> letterToIndex);
// char convertIndex(int index, std::unordered_map<int, char> indexToLetter);

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
    }

    Nan::Utf8String plainText(info[0]);
    Nan::Utf8String key(info[1]);

    std::string cpp_plainText(*plainText);
    std::string cpp_key(*key);

    std::transform(cpp_plainText.begin(), cpp_plainText.end(), cpp_plainText.begin(), ::tolower);
    std::transform(cpp_key.begin(), cpp_key.end(), cpp_key.begin(), ::tolower);

    cpp_plainText.erase(std::remove_if(cpp_plainText.begin(), cpp_plainText.end(), ::isspace), cpp_plainText.end());
    cpp_key.erase(std::remove_if(cpp_key.begin(), cpp_key.end(), ::isspace), cpp_key.end());

    if (cpp_key.size() > cpp_plainText.size()) {
        Nan::ThrowRangeError("The length of the key must not exceed the length of the plaintext");
        return;
    }
    
    int x = cpp_plainText.size();

    for (int i = 0; ;i++) {
        if (x == i) {
            i = 0;
        }
        if (cpp_key.size() == cpp_plainText.size()) {
            break;
        }
        cpp_key.push_back(cpp_key[i]);
    }

    std::unordered_map<char, int> letterToIndex;
    std::unordered_map<int, char> indexToLetter;
    
    createLookup(letterToIndex, indexToLetter);

    std::string cpp_cipherText;

    for (int i = 0; i < cpp_plainText.length(); i++) {
        int plainIndex = letterToIndex[cpp_plainText.at(i)];
        int keyIndex = letterToIndex[cpp_key.at(i)];
        int cipherIndex = (plainIndex + keyIndex) % 26;
        cpp_cipherText.append(1, indexToLetter[cipherIndex]);
    }

    
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

    Nan::Utf8String cipherText_(info[0]);
    Nan::Utf8String key_(info[1]);

    std::string cpp_cipherText_(*cipherText_);
    std::string cpp_key_(*key_);

    std::transform(cpp_cipherText_.begin(), cpp_cipherText_.end(), cpp_cipherText_.begin(), ::tolower);
    std::transform(cpp_key_.begin(), cpp_key_.end(), cpp_key_.begin(), ::tolower);

    cpp_cipherText_.erase(std::remove_if(cpp_cipherText_.begin(), cpp_cipherText_.end(), ::isspace), cpp_cipherText_.end());
    cpp_key_.erase(std::remove_if(cpp_key_.begin(), cpp_key_.end(), ::isspace), cpp_key_.end());

    if (cpp_key_.size() > cpp_cipherText_.size()) {
        Nan::ThrowRangeError("The length of the key must not exceed the length of the ciphertext");
        return;
    }

    int x = cpp_cipherText_.size();

    for (int i = 0; ;i++) {
        if (x == i) {
            i = 0;
        }
        if (cpp_key_.size() == cpp_cipherText_.size()) {
            break;
        }
        cpp_key_.push_back(cpp_key_[i]);
    }
    
    std::unordered_map<char, int> letterToIndex_;
    std::unordered_map<int, char> indexToLetter_;

    createLookup(letterToIndex_, indexToLetter_);

    std::string cpp_plainText_;

    for (int i = 0; i < cpp_cipherText_.length(); i++) {
        int cipherIndex_ = letterToIndex_[cpp_cipherText_.at(i)];
        int keyIndex_ = letterToIndex_[cpp_key_.at(i)];
        int plainIndex_ = (cipherIndex_ - keyIndex_ + 26) % 26;
        cpp_plainText_.append(1, indexToLetter_[plainIndex_]);
    }

    
    v8::Local<v8::String> res_ = Nan::New(cpp_plainText_).ToLocalChecked();

    info.GetReturnValue().Set(res_);
}

NAN_MODULE_INIT(Init)
{
    Nan::Set(target, Nan::New("encrypt").ToLocalChecked(), 
        Nan::GetFunction(Nan::New<v8::FunctionTemplate>(encrypt)).ToLocalChecked());

    Nan::Set(target, Nan::New("decrypt").ToLocalChecked(), 
        Nan::GetFunction(Nan::New<v8::FunctionTemplate>(decrypt)).ToLocalChecked());
}

NODE_MODULE(vigenere_cipher, Init)