import { NotImplementedError } from '../common.js'

/**
 * Define a interface for get a image and return the barcode displayed in it
 */
class BarcodeReaderRepository {
  getBarcodes () {
    throw NotImplementedError()
  }
}

export { BarcodeReaderRepository }
