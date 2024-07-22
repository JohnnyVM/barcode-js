// src/adapters/wasmAdapter.js
import { ImageDataPort } from '../interfaces/imageDataPort.js'

/**
 * Implements the ImageDataPort for interacting with the WebAssembly module.
 * @extends ImageDataPort
 */
export class WasmAdapter extends ImageDataPort {
  constructor (wasmModule) {
    super()
    this.wasmModule = wasmModule;
  }

  async detectBarcode (imageData) {
    const symbols = await this.wasmModule.detect(imageData);

    symbols.forEach(s => s.rawData = s.decode())
    return JSON.stringify(symbols, null, 2)
  }
}
