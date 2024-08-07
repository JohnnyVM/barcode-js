import { BarcodeScanner } from './core/barcodeScanner.js'
import { BarcodeHandler } from './core/barcodeHandler.js'
import { VideoAdapter } from './adapters/videoAdapter.js'
import { WasmAdapter } from './adapters/wasmAdapter.js'
import { config } from './config.js'
import './components/cartList.js'
import './components/videoContainer.js'
import './components/customFooter.js'
import './components/cartItem.js'
import './components/zoomSlide.js'
import './components/settingsDialog.js'

import { BarcodeDetectorPolyfill } from "https://cdn.jsdelivr.net/npm/@undecaf/barcode-detector-polyfill@latest/dist/main.js";

async function loadWasmModule() {
  try {
    window['BarcodeDetector'].getSupportedFormats()
  } catch {
    window['BarcodeDetector'] = BarcodeDetectorPolyfill
  }
  const supportedFormats = await window['BarcodeDetector'].getSupportedFormats()
  return new window['BarcodeDetector']({ formats: supportedFormats });
}

document.addEventListener('DOMContentLoaded', async () => {
  const videoElement = document.querySelector('video-container')
  const videoAdapter = new VideoAdapter(videoElement.video)

  const wasmModule = await loadWasmModule()
  const wasmAdapter = new WasmAdapter(wasmModule)

  const barcodeHandler = new BarcodeHandler(config['url'])

  const scanner = new BarcodeScanner(videoAdapter, wasmAdapter)
  scanner.onBarcodeDetected = barcodeHandler.handleBarcodeDetected.bind(barcodeHandler)

  const back = document.querySelector('cart-list');

  const barcodeButton = document.querySelector('custom-footer button.barcode-scanner')
  barcodeButton.addEventListener("mousedown", (ev) => {
    scanner.startScanning()
  });
  barcodeButton.addEventListener("touchstart", (ev) => {
    ev.preventDefault();
    ev.stopImmediatePropagation();
    scanner.startScanning()
  });
  barcodeButton.addEventListener("mouseup", (ev) => {
    scanner.stopScanning()
  });
  barcodeButton.addEventListener("touchend", (ev) => {
    ev.preventDefault();
    ev.stopImmediatePropagation();
    scanner.stopScanning()
  });
  barcodeButton.addEventListener("touchcancel", (ev) => {
    scanner.stopScanning()
  });
  barcodeButton.addEventListener("mouseleave", (ev) => {
    scanner.stopScanning()
  });
})
