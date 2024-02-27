#include <nan.h>
#include <map>
#include "./../include/lookupAlphabet.hpp"


NAN_METHOD(encrypt)
{
    if (info.Length() < 2)
    {
        Nan::ThrowTypeError("Wrong number of arguments");
        return;
    }

    if (!info[0]->IsUint8Array())
    {
        Nan::ThrowTypeError("The first argument should be an Array of Bytes");
        return;
    }

    if (!info[1]->IsUint32())
    {
        Nan::ThrowTypeError("The second argument should be an Integer");
        return;
    }

    if (!info[2]->IsString())
    {
        Nan::ThrowTypeError("The third argument should be a String");
        return;
    }

    v8::Local<v8::Uint8Array> byteArray = v8::Local<v8::Uint8Array>::Cast(info[0]);
    uint32_t size = Nan::To<uint32_t>(info[1]).FromJust();
    Nan::Utf8String key(info[2]);

    char* cpp_byteArray = static_cast<char*>(byteArray->Buffer()->Data());
    std::string cpp_key(*key);

    // std::transform(cpp_key.begin(), cpp_key.end(), cpp_key.begin(), ::tolower);

    // cpp_key.erase(std::remove_if(cpp_key.begin(), cpp_key.end(), ::isspace), cpp_key.end());
    

    std::string cpp_cipherText;

    if (cpp_key.size() > size) {
        cpp_key = cpp_key.substr(0, size);
    } else if (cpp_key.size() < size) {
        int i = 0;
        while (cpp_key.size() < size) {
            cpp_key.push_back(cpp_key.at(i));
            i++;
        }
    }
    
    char* encrypted = new char[size];
    for (int i = 0; i < size; i++) {
        int encryptedValue = (cpp_byteArray[i] + uint8_t(cpp_key.at(i))) % 256;
        encrypted[i] = encryptedValue;
    }
    
    // v8::Local<v8::String> res = Nan::New(cpp_cipherText).ToLocalChecked();
    // v8::Local<v8::Uint8Array> res = Nan::New(encrypted);

    Nan::MaybeLocal<v8::Object> buf = Nan::NewBuffer(encrypted, size);
    
    info.GetReturnValue().Set(buf.ToLocalChecked());
}

NAN_METHOD(decrypt)
{
    if (info.Length() < 2)
    {
        Nan::ThrowTypeError("Wrong number of arguments");
        return;
    }

    if (!info[0]->IsUint8Array())
    {
        Nan::ThrowTypeError("The first argument should be an Array of Bytes");
        return;
    }

    if (!info[1]->IsUint32())
    {
        Nan::ThrowTypeError("The second argument should be an Integer");
        return;
    }

    if (!info[2]->IsString())
    {
        Nan::ThrowTypeError("The third argument should be a String");
        return;
    }

    v8::Local<v8::Uint8Array> byteArray = v8::Local<v8::Uint8Array>::Cast(info[0]);
    uint32_t size = Nan::To<uint32_t>(info[1]).FromJust();
    Nan::Utf8String key(info[2]);

    char* cpp_byteArray = static_cast<char*>(byteArray->Buffer()->Data());
    std::string cpp_key(*key);

    std::string cpp_cipherText;

    if (cpp_key.size() > size) {
        cpp_key = cpp_key.substr(0, size);
    } else if (cpp_key.size() < size) {
        int i = 0;
        while (cpp_key.size() < size) {
            cpp_key.push_back(cpp_key.at(i));
            i++;
        }
    }

    char* decrypted = new char[size];
    for (int i = 0; i < size; i++) {
        int decryptedValue = (cpp_byteArray[i] - uint8_t(cpp_key.at(i)) + 256) % 256;
        decrypted[i] = decryptedValue;
    }

    Nan::MaybeLocal<v8::Object> buf = Nan::NewBuffer(decrypted, size);
    
    info.GetReturnValue().Set(buf.ToLocalChecked());
}

NAN_MODULE_INIT(Init)
{
    Nan::Set(target, Nan::New("encrypt").ToLocalChecked(), 
        Nan::GetFunction(Nan::New<v8::FunctionTemplate>(encrypt)).ToLocalChecked());

    Nan::Set(target, Nan::New("decrypt").ToLocalChecked(), 
        Nan::GetFunction(Nan::New<v8::FunctionTemplate>(decrypt)).ToLocalChecked());
}

NODE_MODULE(extended_vigenere_cipher, Init)