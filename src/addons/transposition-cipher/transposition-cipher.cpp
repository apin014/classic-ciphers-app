#include <nan.h>

bool isNotAlpha(char c) {return !isalpha(c);}

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

    if (!info[1]->IsInt32())
    {
        Nan::ThrowTypeError("The second argument should be a Number");
        return;
    }

    Nan::Utf8String plainText(info[0]);
    int32_t key = Nan::To<int32_t>(info[1]).FromJust();

    std::string cpp_plainText(*plainText);

    std::transform(cpp_plainText.begin(), cpp_plainText.end(), cpp_plainText.begin(), ::tolower);

    cpp_plainText.erase(std::remove_if(cpp_plainText.begin(), cpp_plainText.end(), ::isspace), cpp_plainText.end());
    cpp_plainText.erase(std::remove_if(cpp_plainText.begin(), cpp_plainText.end(), ::isNotAlpha), cpp_plainText.end());

    if (key >= cpp_plainText.size()) {
        Nan::ThrowRangeError("The key cannot be larger or equal to the length of the plain text");
        return;
    }
    
    if ((cpp_plainText.size() % key) != 0) {
        cpp_plainText.append(key - (cpp_plainText.size() % key), 'x');
    }

    // int id = 0;
    // while (cpp_plainText.size() % key != 0) {
    //     cpp_plainText.push_back(cpp_plainText.at(id));
    //     id++;
    // }
    
    int row, col;
    row = cpp_plainText.size() / key;
    col = key;

    char m[row][col];

    int it = 0;
    for (int i = 0; i < row; i++) {
        for (int j = 0; j < col; j++) {
            m[i][j] = cpp_plainText.at(it);
            it++;
        }
    }

    std::string cpp_cipherText;
    for (int i = 0; i < col; i++) {
        for (int j = 0; j < row; j++) {
            cpp_cipherText.push_back(m[j][i]);
        }
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

    if (!info[1]->IsInt32())
    {
        Nan::ThrowTypeError("The second argument should be a Number");
        return;
    }

    Nan::Utf8String cipherText(info[0]);
    int32_t key = Nan::To<int32_t>(info[1]).FromJust();

    std::string cpp_cipherText(*cipherText);

    std::transform(cpp_cipherText.begin(), cpp_cipherText.end(), cpp_cipherText.begin(), ::tolower);

    cpp_cipherText.erase(std::remove_if(cpp_cipherText.begin(), cpp_cipherText.end(), ::isspace), cpp_cipherText.end());
    // cpp_cipherText.erase(std::remove_if(cpp_cipherText.begin(), cpp_cipherText.end(), ::isNotAlpha), cpp_cipherText.end());

    if (key >= cpp_cipherText.size()) {
        Nan::ThrowRangeError("The key cannot be larger or equal to the length of the cipher text");
        return;
    }

    int row, col;
    col = cpp_cipherText.size() / key;
    row = key;

    char m[row][col];

    int it = 0;
    for (int i = 0; i < row; i++) {
        for (int j = 0; j < col; j++) {
            m[i][j] = cpp_cipherText.at(it);
            it++;
        }
    }

    std::string cpp_plainText;
    for (int i = 0; i < col; i++) {
        for (int j = 0; j < row; j++) {
            cpp_plainText.push_back(m[j][i]);
        }
    }

    v8::Local<v8::String> res = Nan::New(cpp_plainText).ToLocalChecked();

    info.GetReturnValue().Set(res);
}

NAN_MODULE_INIT(Init)
{
    Nan::Set(target, Nan::New("encrypt").ToLocalChecked(), 
        Nan::GetFunction(Nan::New<v8::FunctionTemplate>(encrypt)).ToLocalChecked());

    Nan::Set(target, Nan::New("decrypt").ToLocalChecked(), 
        Nan::GetFunction(Nan::New<v8::FunctionTemplate>(decrypt)).ToLocalChecked());
}

NODE_MODULE(transposition_cipher, Init)