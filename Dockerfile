# Point at any base image that you find suitable to extend.
FROM emscripten/emsdk:latest

# Install required tools that are useful for your project i.e. ninja-build
RUN apt update && apt install -y autoconf libtool gettext autogen imagemagick libmagickcore-dev autopoint autoconf-archive pkg-config

# Set user and group
ENV EM_CACHE=/tmp
ARG uid=9999
RUN id ${uid} || adduser -u ${uid} -ms /bin/sh emcc
RUN chown ${uid} /src
RUN mkdir /output && chown ${uid} /output

# Switch to user
USER ${uid}:${gid}

RUN cd /src \
    && git clone https://github.com/mchehab/zbar.git \
    && cd zbar \
    && sed -i "s/ -Werror//" $(pwd)/configure.ac \
    && autoreconf -i \
    && emconfigure ./configure --without-x --without-jpeg --without-imagemagick --without-npapi --without-gtk --without-python --without-qt --without-xshm --disable-video --disable-pthread \
    && emmake make

RUN cd /
COPY ./entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
