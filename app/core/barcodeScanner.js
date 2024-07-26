/**
 * BarcodeScanner is responsible for the core logic of scanning barcodes from the video feed.
 */
export class BarcodeScanner {
  /**
   * Barcode detector callback
   * @type {function(Object):void}
   */
  onBarcodeDetected

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
   * Begin to scan the images
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

    const imageData = await this.cameraPort.captureImage();
    const barcode = await this.imageDataPort.detectBarcode(imageData);
    if (barcode.length && this.onBarcodeDetected) {
      this.onBarcodeDetected(barcode);
    }

    setTimeout(() => requestAnimationFrame(() => this.scanFrame()), 500)
  }
}
