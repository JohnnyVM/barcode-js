#!/bin/env bash

# Docker command docker build --no-cache --tag barcodejs:latest --build-arg=uid=$(id -u) .

if [[ $1 = "run" ]]; then
docker run -ti \
	-v $(pwd)/src:/code \
	-v $(pwd)/app/module/barcode-detector/:/output \
	--workdir /output \
	--entrypoint /bin/bash \
	barcodejs:latest
else
docker run -ti \
	-v $(pwd)/src:/code \
	-v $(pwd)/app/module/barcode-detector/:/output \
	--user $(id -u):$(id -g) \
	--workdir /output \
	--entrypoint emcc \
	barcodejs:latest \
	-O3 -fno-exceptions -sFILESYSTEM=0 -flto -s WASM=1 -v \
	--js-library /code/scan.js \
	-s EXPORTED_RUNTIME_METHODS='["cwrap", "UTF8ToString"]' \
	-sASSERTIONS -sMODULARIZE -s 'EXPORT_NAME="ZBar"' -s EXPORT_ES6=1 \
	-I /src/ZBar/include /code/scan.c /src/ZBar/zbar/.libs/libzbar.a \
	--cache /tmp \
	-o zbar.js
fi
