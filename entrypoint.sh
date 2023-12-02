#!/bin/env bash

# automatically compile the program
CC=emcc
INCLUDES="-isystem /src/zbar/include"
LIBS="-L/src/zbar/zbar/.libs/ -l:libzbar.a"
PROJECT_PATH="/code/"
SOURCE="scan.c"
OUTPUT="zbar.js"
${CC} ${INCLUDES} ${LIBS} ${PROJECT_PATH}/${SOURCE} -o ${OUTPUT}
