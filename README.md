# Barcode JS
Javascript module for analize barcodes with wasm if no BarcodeReader available


## Start up
Build the project:  
```
$ [podman|docker] build --no-cache --tag barcodejs:latest --build-arg=uid=$(id -u) .
$ sh ./build [dev]
$ sh ./server start
```

