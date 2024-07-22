// main.js
import { BarcodeScanner } from './core/barcodeScanner.js'
import { BarcodeHandler } from './core/barcodeHandler.js'
import { VideoAdapter } from './adapters/videoAdapter.js'
import { WasmAdapter } from './adapters/wasmAdapter.js'
import './components/videoContainer.js'
import './components/customFooter.js'

import { BarcodeDetectorPolyfill } from "https://cdn.jsdelivr.net/npm/@undecaf/barcode-detector-polyfill@latest/dist/main.js";

async function loadWasmModule() {
    const supportedFormats = await BarcodeDetectorPolyfill.getSupportedFormats()
    return new BarcodeDetectorPolyfill({ formats: supportedFormats });
}

document.addEventListener('DOMContentLoaded', async () => {
  const videoElement = document.querySelector('video-container')
  const videoAdapter = new VideoAdapter(videoElement.video)

  const wasmModule = await loadWasmModule()
  const wasmAdapter = new WasmAdapter(wasmModule)

  const barcodeHandler = new BarcodeHandler('https://api.example.com/products')
  const barcodePort = {
    handleBarcodeDetected: barcodeHandler.handleBarcodeDetected.bind(barcodeHandler)
  }

  const scanner = new BarcodeScanner(videoAdapter, wasmAdapter)

  // Start scanning for barcodes
  scanner.startScanning()
})
