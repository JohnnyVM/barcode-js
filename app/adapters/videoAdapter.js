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
      this.imageCapture = new ImageCapture(this.track);
      const photoCapabilities = await this.imageCapture.getPhotoCapabilities();

      // Adjust constraints to maximum photo capabilities
      this.maxPhotoCapabilities = {
          width: photoCapabilities.width ? { max: photoCapabilities.width.max } : undefined,
          height: photoCapabilities.height ? { max: photoCapabilities.height.max } : undefined,
      };
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
    const blob = await this.imageCapture.takePhoto(this.maxPhotoCapabilities);
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
