#!/bin/env bash

# automatically compile the program
CC=emcc
PROJECT_PATH="/code/"
INCLUDES="-isystem /src/zbar/include"
CLIBS="-L/src/zbar/zbar/.libs/ -l:libzbar.a"
JSLIBS="--js-library /code/scan.js"
SOURCE="scan.c"
OUTPUT="/output/zbar.js"

action=$1; shift
FLAGS="-sMODULARIZE -s EXPORT_NAME='zbar' -s EXPORT_ES6=1 -s EXPORTED_RUNTIME_METHODS=cwrap,UTF8ToString"
if echo $action | grep -q "^dev"; then
	FLAGS= "${FLAGS} -g3 --tracing -sASSERTIONS -fsanitize=null -fsanitize=address"
fi
if echo $action | grep -q "^release"; then
	FLAGS="${FLAGS} -O3 -flto"
fi

echo "${CC} ${FLAGS} ${JSLIBS} ${INCLUDES} ${CLIBS} ${PROJECT_PATH}/${SOURCE} -o ${OUTPUT}"
${CC} ${FLAGS} ${JSLIBS} ${INCLUDES} ${CLIBS} ${PROJECT_PATH}/${SOURCE} -o ${OUTPUT}
