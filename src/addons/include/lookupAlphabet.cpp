#include "lookupAlphabet.hpp"

void createLookup(std::unordered_map<char, int> &letterToIndex, std::unordered_map<int, char> &indexToLetter) {
    letterToIndex['a'] = 0;
    letterToIndex['b'] = 1;
    letterToIndex['c'] = 2;
    letterToIndex['d'] = 3;
    letterToIndex['e'] = 4;
    letterToIndex['f'] = 5;
    letterToIndex['g'] = 6;
    letterToIndex['h'] = 7;
    letterToIndex['i'] = 8;
    letterToIndex['j'] = 9;
    letterToIndex['k'] = 10;
    letterToIndex['l'] = 11;
    letterToIndex['m'] = 12;
    letterToIndex['n'] = 13;
    letterToIndex['o'] = 14;
    letterToIndex['p'] = 15;
    letterToIndex['q'] = 16;
    letterToIndex['r'] = 17;
    letterToIndex['s'] = 18;
    letterToIndex['t'] = 19;
    letterToIndex['u'] = 20;
    letterToIndex['v'] = 21;
    letterToIndex['w'] = 22;
    letterToIndex['x'] = 23;
    letterToIndex['y'] = 24;
    letterToIndex['z'] = 25;

    indexToLetter[0] = 'a';
    indexToLetter[1] = 'b';
    indexToLetter[2] = 'c';
    indexToLetter[3] = 'd';
    indexToLetter[4] = 'e';
    indexToLetter[5] = 'f';
    indexToLetter[6] = 'g';
    indexToLetter[7] = 'h';
    indexToLetter[8] = 'i';
    indexToLetter[9] = 'j';
    indexToLetter[10] = 'k';
    indexToLetter[11] = 'l';
    indexToLetter[12] = 'm';
    indexToLetter[13] = 'n';
    indexToLetter[14] = 'o';
    indexToLetter[15] = 'p';
    indexToLetter[16] = 'q';
    indexToLetter[17] = 'r';
    indexToLetter[18] = 's';
    indexToLetter[19] = 't';
    indexToLetter[20] = 'u';
    indexToLetter[21] = 'v';
    indexToLetter[22] = 'w';
    indexToLetter[23] = 'x';
    indexToLetter[24] = 'y';
    indexToLetter[25] = 'z';
}