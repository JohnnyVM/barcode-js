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

        const overlay = document.createElement('div');
        overlay.classList.add('overlay');

        const line = document.createElement('div');
        line.classList.add('line');

        overlay.appendChild(line);
        this.appendChild(this.video);
        this.appendChild(overlay);
    }

    /** ${1:Description placeholder} */
    connectedCallback() {
        this.startCamera();
    }

    /**
     * ${1:Description placeholder}
     *
     * @async
     * @returns {${2:*}}
     */
    async startCamera() {
        try {
            const video = document.createElement('video');
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            video.srcObject = stream;
            await video.play();

            const settings = stream.getVideoTracks()[0].getSettings();
            const constraints = {
                video: {
                    facingMode: { ideal: 'environment' },
                    width: { max: settings.width },
                    height: { max: settings.height },
                    frameRate: { ideal: 60 }, // Higher frame rate for smooth video
                    focusMode: 'continuous',
                    advanced: [
                        { exposureMode: 'continuous' },
                        { whiteBalanceMode: 'continuous' }
                    ]
                }
            };

            stream.getTracks().forEach(track => track.stop());

            const maxStream = await navigator.mediaDevices.getUserMedia(constraints);
            const videoElement = this.querySelector('#video');
            videoElement.srcObject = maxStream;
        } catch (error) {
            console.error('Error accessing the camera', error);
        }
    }
}

customElements.define('video-container', VideoContainer);
