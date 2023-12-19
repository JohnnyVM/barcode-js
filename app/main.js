import { BarcodeReader } from './module/barcode-detector/ui.js'
import { ProductList, ProductCard } from './module/product/ui.js'
import { identifyDevice } from './module/utils.js'

customElements.define('barcode-reader', BarcodeReader)
customElements.define('product-list', ProductList)
customElements.define('product-card', ProductCard)

const MediaRequirements = {
  audio: false,
  video: {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    facingMode: 'environment'
  }
}

const clearButton = document.querySelector('#clear-list-button')
clearButton.addEventListener('click', () => {
  const productList = document.getElementsByTagName('product-list')[0]
  productList.deleteProductCards()
})

navigator.mediaDevices.getUserMedia(MediaRequirements).then(async function (stream) {
  // -------------------
  const header = document.getElementById('camera-info')

  const track = stream.getVideoTracks()[0]
  const cameraSettings = track.getSettings()

  header.textContent = `${cameraSettings.width}x${cameraSettings.height}`
  // ------------------
  const barcode = document.getElementsByTagName('barcode-reader')[0]
  identifyDevice(stream)
  barcode.srcObject = stream
  await barcode.play()
})
