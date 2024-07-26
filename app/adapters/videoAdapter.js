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
    await new Promise(resolve => {
      this.videoElement.onloadedmetadata = () => resolve()
    })

    if ('ImageCapture' in window) {
      this.track = this.videoElement.srcObject.getVideoTracks()[0];
    }

    return new Promise(resolve => resolve())
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

  async capturePhoto() {
    const capture = await new ImageCapture(this.track);
    const blob = await capture.takePhoto();
    const image = await createImageBitmap(blob)
    return image
  }

  async captureImage() {
    if ('ImageCapture' in window) {
      return this.capturePhoto();
    } else {
      return this.captureFrame()
    }
  }

  stop () {
    if(this.track) {
      this.track.stop();
    }
  }
}
