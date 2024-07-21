// src/adapters/videoAdapter.js
import { CameraPort } from '../interfaces/cameraPort.js';

export class VideoAdapter extends CameraPort {
    constructor(videoElement) {
        super();
        this.videoElement = videoElement;
        this.stream = null;
    }

    async init() {
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

        this.stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.videoElement.srcObject = this.stream;
        return new Promise(resolve => {
            this.videoElement.onloadedmetadata = () => resolve();
        });
    }

    async captureFrame() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = this.videoElement.videoWidth;
        canvas.height = this.videoElement.videoHeight;
        context.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
        return context.getImageData(0, 0, canvas.width, canvas.height);
    }

    stop() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
    }
}
