# Point at any base image that you find suitable to extend.
FROM emscripten/emsdk:latest

# Install required tools that are useful for your project i.e. ninja-build
RUN apt update && apt install -y autoconf libtool gettext autogen imagemagick libmagickcore-dev

RUN cd /src \
    && git clone https://github.com/ZBar/ZBar \
    && cd ZBar \
    && sed -i "s/ -Werror//" $(pwd)/configure.ac \
    && autoreconf -i \
    && emconfigure ./configure --without-x --without-jpeg --without-imagemagick --without-npapi --without-gtk --without-python --without-qt --without-xshm --disable-video --disable-pthread \
    && emmake make