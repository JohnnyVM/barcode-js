// src/adapters/wasmAdapter.js
import { ImageDataPort } from '../interfaces/imageDataPort.js'

/**
 * Implements the ImageDataPort for interacting with the WebAssembly module.
 * @extends ImageDataPort
 */
export class WasmAdapter extends ImageDataPort {
  /**
   * @constructor
   * @param {BarcodeDetector} wasmModule - Barcode detector class
   */
  constructor (wasmModule) {
    super()
    this.wasmModule = wasmModule;
  }

  /**
   * Return a array with the list of barcodes detected
   *
   * @async
   * @param {ImageBitmap} imageData - Image input
   * @returns {Promise<DetectedBarcode[]>} [TODO:description]
   */
  async detectBarcode (imageData) {
    return await this.wasmModule.detect(imageData);
  }
}
