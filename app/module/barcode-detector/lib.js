import Module from './zbar.js'

class ZBar {
  static #instance = null
  static #semaphore = false // meh

  static async getInstance () {
    if (this.#instance === null && !this.#semaphore) {
      this.#semaphore = true
      this.#instance = await Module()
    }
    return this.#instance
  }
}

async function scanImage (image) {
  const modZBar = await ZBar.getInstance()

  // wrap all C functions using cwrap. Note that we have to provide crwap with the function signature.
  const api = {
    scan_image: modZBar.cwrap('scan_image', '', ['number', 'number', 'number']),
    create_buffer: modZBar.cwrap('create_buffer', 'number', ['number', 'number']),
    destroy_buffer: modZBar.cwrap('destroy_buffer', '', ['number'])
  }

  // convert the image data to grayscale
  const grayData = []
  const d = image.data
  for (let i = 0, j = 0; i < d.length; i += 4, j++) {
    grayData[j] = (d[i] * 66 + d[i + 1] * 129 + d[i + 2] * 25 + 4096) >> 8
  }

  // put the data into the allocated buffer on the wasm heap.
  const p = api.create_buffer(image.width, image.height)
  modZBar.HEAP8.set(grayData, p)

  // call the scanner function
  api.scan_image(p, image.width, image.height)

  // clean up
  // (this is not really necessary in this example as we could reuse the buffer, but is used to demonstrate how you can manage Wasm heap memory from the js environment)
  api.destroy_buffer(p)
}

export { scanImage, ZBar }
