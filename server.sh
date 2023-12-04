#!/bin/sh

CONTAINER_ENGINE=""
if $(command -v podman >/dev/null 2>&1); then
	CONTAINER_ENGINE="podman"
else
	CONTAINER_ENGINE="docker"
fi

menu () {
	echo "usage $(basename $0) [-h] (stop|start)"
}

if [ $# -eq 0 ]; then
    echo "No arguments supplied"
	exit 0
fi

PORT="8080"
action=$1; shift
while getopts hp: opt; do
	case "${opt}" in
		h) menu;;
		:) menu;;
		\?) menu;;
		p) PORT=${OPTARG}
			;;
	esac
done

PODNAME="barcode-js-web"

if echo $action | grep -q "^stop$"; then
	${CONTAINER_ENGINE} stop ${PODNAME}
	exit 0
fi

if echo $action | grep -q "^start$"; then
	${CONTAINER_ENGINE} run --rm -d \
		--name ${PODNAME} -p "${PORT}:80" \
		-v "${PWD}/app:/usr/local/apache2/htdocs/:ro" \
		docker.io/library/httpd:latest
	exit 0
fi

exit 1
