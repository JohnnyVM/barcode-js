import { jest } from '@jest/globals'
import BarcodeReader from '../../service/barcode_reader.js'

describe('BarcodeReader', () => {
  test('retrieve barcode info from image', () => {
    const barcode = new BarcodeReader()
    expect(barcode).toBe(BarcodeReader)
  })
})
