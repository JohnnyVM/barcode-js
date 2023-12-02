#!/bin/env bash

# Docker command docker build --no-cache --tag barcodejs:latest --build-arg=uid=$(id -u) .
CONTAINER_ENGINE=""
if $(command -v podman >/dev/null 2>&1); then
	CONTAINER_ENGINE="podman"
else
	CONTAINER_ENGINE="docker"
fi

action=$1; shift

FLAGS="-O3 -flto"
if echo $action | grep -q "^dev$"; then
	FLAGS="-sASSERTIONS -fsanitize=null -fsanitize=address"
fi

${CONTAINER_ENGINE} run -ti \
	-v /tmp:/tmp \
	-v ${PWD}/src:/code \
	-v ${PWD}/app/module/barcode-detector/:/output \
	--user $(id -u):$(id -g) \
	--workdir /output \
	--entrypoint emcc \
	barcodejs:latest \
	-fno-exceptions -sFILESYSTEM=0 -s WASM=1 -v \
	-sENVIRONMENT=web \
	--js-library /code/scan.js \
	-s EXPORTED_RUNTIME_METHODS='["cwrap", "UTF8ToString"]' \
	-sMODULARIZE -s 'EXPORT_NAME="zbar"' -s EXPORT_ES6=1 \
	-I /src/zbar/include /code/scan.c /src/zbar/zbar/.libs/libzbar.a \
	--cache /tmp \
	${FLAGS} \
	-o zbar.js
