import { NotImplementedError } from '../error.js'

/**
 * Copy of BarcodeDetector detect output
 * https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector/detect
 */
class DetectedBarcode {
  /**
   * see class documentation link for more info
   * @type DOMRectReadOnly
   */
  boundingBox
  /* TODO */
}

/**
 * Barcode reader
 */
class BarcodeReader {
  /**
   * given a image return a array with the barcodes displayed
   *
   * @param ImageBitmap imageBitmapSource - image to scan
   * @returns Promise<Array<DetectedBarcode>> array of detected barcodes
   */
  detect (imageBitmapSource) {
    return new DetectedBarcode()
  }

  getSupportedFormats () {
    throw NotImplementedError()
  }
}

function BarcodeReaderFactory () {
  // TODO analize if is interesting return the BarcodeDetector API class
  // https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector
  return new BarcodeReader()
}

export { BarcodeReaderFactory }
