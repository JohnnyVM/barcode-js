// main.js
import { BarcodeScanner } from './core/barcodeScanner.js'
import { BarcodeHandler } from './core/barcodeHandler.js'
import { VideoAdapter } from './adapters/videoAdapter.js'
import { WasmAdapter } from './adapters/wasmAdapter.js'
import './components/videoContainer.js'
import './components/customFooter.js'

async function loadWasmModule () {
  const response = await fetch('barcode.wasm')
  const buffer = await response.arrayBuffer()
  const wasmModule = await WebAssembly.compile(buffer)
  return WebAssembly.instantiate(wasmModule)
}

document.addEventListener('DOMContentLoaded', async () => {
  const videoElement = document.querySelector('video-container video')
  const videoAdapter = new VideoAdapter(videoElement)

  //const wasmModule = await loadWasmModule()
  //const wasmAdapter = new WasmAdapter(wasmModule)
  const wasmAdapter = new Object()

  const barcodeHandler = new BarcodeHandler('https://api.example.com/products')
  const barcodePort = {
    handleBarcodeDetected: barcodeHandler.handleBarcodeDetected.bind(barcodeHandler)
  }

  const scanner = new BarcodeScanner(videoAdapter, wasmAdapter, barcodePort)

  // Initialize custom elements
  const cartModal = document.querySelector('custom-modal-cart')
  const menuDrawer = document.querySelector('custom-menu-drawer')

  // Start scanning for barcodes
  scanner.startScanning()
})
