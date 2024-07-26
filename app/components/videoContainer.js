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
            //const capabilities = track.getCapabilities();
            //const supported = track.getSupportedConstraints();
            const constraints = { video: {facingMode: { ideal: 'environment' }}, audio: false }

            const videoElement = this.querySelector('#video');
            const maxStream = await navigator.mediaDevices.getUserMedia(constraints);
            videoElement.srcObject = maxStream

            const videoTrack = maxStream.getVideoTracks()[0];
            const zoomSlider = document.getElementById('zoom-slider');
            zoomSlider.setVideoTrack(videoTrack);
        } catch (error) {
            console.error('Error accessing the camera', error);
        }
    }
}

customElements.define('video-container', VideoContainer);
