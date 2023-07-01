#!/bin/env bash

# Docker command docker build --no-cache --tag barcodejs:latest --build-arg=uid=$(id -u) .

FLAGS="-O3 -flto"
#FLAGS="-sASSERTIONS -fsanitize=null -fsanitize=address"
#FLAGS="-sSAFE_HEAP -sASSERTIONS"

docker run -ti \
	-v /tmp:/tmp \
	-v $(pwd)/src:/code \
	-v $(pwd)/app/module/barcode-detector/:/output \
	--user $(id -u):$(id -g) \
	--workdir /output \
	--entrypoint emcc \
	barcodejs:latest \
	-fno-exceptions -sFILESYSTEM=0 -s WASM=1 -v \
	-sENVIRONMENT=web \
	--js-library /code/scan.js \
	-s EXPORTED_RUNTIME_METHODS='["cwrap", "UTF8ToString"]' \
	-sMODULARIZE -s 'EXPORT_NAME="zbar"' -s EXPORT_ES6=1 \
	-I /src/ZBar/include /code/scan.c /src/ZBar/zbar/.libs/libzbar.a \
	--cache /tmp \
	${FLAGS} \
	-o zbar.js
