/**
 * BarcodeScanner is responsible for the core logic of scanning barcodes from the video feed.
 */
export class BarcodeScanner {
  /**
   * Creates an instance of BarcodeScanner.
   *
   * @constructor
   * @param {CameraPort} cameraPort
   * @param {ImageDataPort} imageDataPort
   */
  constructor (cameraPort, imageDataPort) {
    this.cameraPort = cameraPort
    this.imageDataPort = imageDataPort
    this.isScanning = false
    this.onBarcodeDetected = null
  }

  /**
   * Begin to san the images
   *
   * @async
   * @returns {${2:*}}
   */
  async startScanning () {
    if (!this.isScanning) {
      this.isScanning = true
      await this.cameraPort.init()
      this.scanFrame()
    }
  }

  /** ${1:Description placeholder} */
  stopScanning () {
    this.isScanning = false
    this.cameraPort.stop()
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @returns {${2:*}}
   */
  async scanFrame () {
    if (!this.isScanning) return

    const imageData = await this.cameraPort.captureFrame()
    const barcode = await this.imageDataPort.detectBarcode(imageData)

    if (barcode && this.onBarcodeDetected) {
      this.onBarcodeDetected(barcode)
    }

    requestAnimationFrame(() => this.scanFrame())
  }
}
