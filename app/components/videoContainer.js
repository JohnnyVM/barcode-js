import { ErrorHandler } from './errorHandler.js'

/**
 * Video Container class
 * 
 * @todo Video container should be splited in VideoContainer and Photo container
 * and select photo if imgeCapture is available
 * @extends HTMLElement
 */
export class VideoContainer extends HTMLElement {
    /**
     * Creates an instance of VideoContainer.
     *
     * @constructor
     */
    constructor() {
        super();
        this.video = document.createElement('video');
        this.video.setAttribute('id', 'video');
        this.video.setAttribute('autoplay', '');

        const overlay = document.createElement('div');
        overlay.classList.add('overlay');

        const line = document.createElement('div');
        line.classList.add('line');

        overlay.appendChild(line);
        this.appendChild(this.video);
        this.appendChild(overlay);
    }

    /** Called when the element is added to the document */
    connectedCallback() {
        this.startCamera();
    }

    /**
     * Starts the camera and sets up the video stream
     *
     * @async
     */
    async startCamera() {
        try {
            const constraints = {
                video: {
                    facingMode: { ideal: 'environment' },
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    frameRate: { ideal: 60 },
                },
                audio: false
            };

            const maxStream = await navigator.mediaDevices.getUserMedia(constraints);
            this.video.srcObject = maxStream;
            await this.video.play();

            const videoTrack = maxStream.getVideoTracks()[0];

            if (videoTrack.getCapabilities) {
                // Get the capabilities
                const capabilities = videoTrack.getCapabilities();

                // Adjust constraints to maximum capabilities
                const maxConstraints = {
                    width: capabilities.width ? { max: capabilities.width.max } : undefined,
                    height: capabilities.height ? { max: capabilities.height.max } : undefined,
                    frameRate: capabilities.frameRate ? { max: capabilities.frameRate.max } : undefined,
                    facingMode: 'environment',
                };

                await videoTrack.applyConstraints(maxConstraints);
            }

            const zoomSlider = document.getElementById('zoom-slider');
            if (zoomSlider) {
                zoomSlider.setVideoTrack(videoTrack);
            }

        } catch (error) {
          ErrorHandler.handleError(error, 'Error al iniciar la cámara. Por favor verifique la configuración y los permisos de su cámara.');
        }
      }
}

customElements.define('video-container', VideoContainer);
