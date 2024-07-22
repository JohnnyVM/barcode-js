// src/adapters/videoAdapter.js
import { CameraPort } from '../interfaces/cameraPort.js'

/**
 * Implements the CameraPort for interacting with the video element.
 * @extends CameraPort
 */
export class VideoAdapter extends CameraPort {
  /**
   * @param {HTMLMediaElement} videoElement - Video element
   */
  constructor (videoElement) {
    super()
    this.videoElement = videoElement
  }

  /**
   * Ensure the video is properly working before is used
   *
   * @async
   * @returns {Promise<[TODO:type]>} [TODO:description]
   */
  async init () {
    return new Promise(resolve => {
      this.videoElement.onloadedmetadata = () => resolve()
    })
  }

  /**
   * Capture a frame from the video element
   *
   * @async
   * @returns {Promise<[TODO:type]>} [TODO:description]
   */
  async captureFrame () {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = this.videoElement.videoWidth
    canvas.height = this.videoElement.videoHeight
    context.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height)
    return context.getImageData(0, 0, canvas.width, canvas.height)
  }

  stop () {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
    }
  }
}
