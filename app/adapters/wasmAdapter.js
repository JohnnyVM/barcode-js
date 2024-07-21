// src/adapters/wasmAdapter.js
import { ImageDataPort } from '../interfaces/imageDataPort.js';

export class WasmAdapter extends ImageDataPort {
    constructor(wasmModule) {
        super();
        this.wasmModule = wasmModule;
    }

    detectBarcode(imageData) {
        const { detectBarcode } = this.wasmModule.instance.exports;
        // Assuming `detectBarcode` takes raw image data, width, and height
        return detectBarcode(imageData.data, imageData.width, imageData.height);
    }
}
