#!/bin/env bash

# Docker command docker build --no-cache --tag barcodejs:latest --build-arg=uid=$(id -u) .

docker run -ti \
	-v /tmp:/tmp \
	-v $(pwd)/src:/code \
	-v $(pwd)/app/module/barcode-detector/:/output \
	--user $(id -u):$(id -g) \
	--workdir /output \
	--entrypoint emcc \
	barcodejs:latest \
	-O3 -fno-exceptions -sFILESYSTEM=0 -flto -s WASM=1 -v \
	-sENVIRONMENT=web \
	--js-library /code/scan.js \
	-s EXPORTED_RUNTIME_METHODS='["cwrap", "UTF8ToString"]' \
	-sASSERTIONS -sMODULARIZE -s 'EXPORT_NAME="zbar"' -s EXPORT_ES6=1 \
	-I /src/ZBar/include /code/scan.c /src/ZBar/zbar/.libs/libzbar.a \
	--cache /tmp \
	-o zbar.js
