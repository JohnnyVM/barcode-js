/**
 * Video Container class
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

        this.photo = document.createElement('img');
        this.photo.setAttribute('id', 'photo');

        const overlay = document.createElement('div');
        overlay.classList.add('overlay');

        const line = document.createElement('div');
        line.classList.add('line');

        overlay.appendChild(line);
        this.appendChild(this.video);
        this.appendChild(this.photo);
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
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
            this.video.srcObject = stream;
            await this.video.play();

            const track = stream.getVideoTracks()[0];
            //const capabilities = track.getCapabilities();
            //const supported = track.getSupportedConstraints();
            const settings = track.getSettings();
            const constraints = {
                width: { max: settings.width },
                height: { max: settings.height },
                frameRate: { ideal: 60 }, // Higher frame rate for smooth video
            };

            await track.applyConstraints(constraints);

            if ('ImageCapture' in window) {
                const imageCapture = new ImageCapture(track);
                this.capturePhoto(imageCapture);
            }

        } catch (error) {
            console.error('Error accessing the camera', error);
        }
    }

    /**
     * Captures a photo from the video stream every 300ms
     *
     * @param {ImageCapture} imageCapture
     */
    async capturePhoto(imageCapture) {
        const captureInterval = 300;
        const captureLoop = async () => {
            try {
                const photo = await imageCapture.takePhoto();
                const photoBlob = URL.createObjectURL(photo);
                this.photo.src = photoBlob;
            } catch (error) {
                console.error('Error capturing photo', error);
            }
            setTimeout(captureLoop, captureInterval);
        };

        captureLoop();
    }
}

customElements.define('video-container', VideoContainer);
