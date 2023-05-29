#!/bin/env bash

# Docker command docker build --no-cache --tag barcodejs:latest --build-arg=user=$(id -n) .

if [[ $1 = "run" ]]; then
docker run -ti \
	-v $(pwd)/src:/code \
	-v $(pwd)/app/js:/output \
	--workdir /output \
	--entrypoint /bin/bash \
	barcodejs:latest
else
docker run -ti \
	-v $(pwd)/src:/code \
	-v $(pwd)/app/js:/output \
	--user $(id -u):$(id -g) \
	--workdir /output \
	--entrypoint emcc \
	barcodejs:latest \
	-O3 -s WASM=1 \
	--js-library /code/scan.js \
	-s EXPORTED_RUNTIME_METHODS='["cwrap", "UTF8ToString"]' \
	-I /src/ZBar/include /code/scan.c /src/ZBar/zbar/.libs/libzbar.a \
	--cache /tmp
fi
