// customZoomSlider.js
export class ZoomSlider extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: None;
                    justify-content: center;
                    align-items: center;
                    padding: 10px;
                    background-color: #f5f5f5;
                }
                input[type="range"] {
                    width: 80%;
                }
            </style>
            <input type="range" min="1" max="5" step="0.1" value="1">
        `;

        this.videoTrack = null;
        this.shadowRoot.querySelector('input').addEventListener('input', (event) => {
            this.updateZoom(event.target.value);
        });
    }

    setVideoTrack(track) {
        this.videoTrack = track;
        //this.updateZoom(this.shadowRoot.querySelector('input').value);
        if(typeof(this.videoTrack.getCapabilities) === "function") {
            const capabilities = this.videoTrack.getCapabilities();
            if(capabilities.zoom) {
                this.style.display = 'flex';
            }
        }
    }

    updateZoom(value) {
        if (this.videoTrack) {
            const capabilities = this.videoTrack.getCapabilities();

            if (capabilities.zoom) {
                this.videoTrack.applyConstraints({
                    advanced: [{ zoom: value }]
                });
            } else {
                console.warn('Zoom not supported on this device.');
            }
        }
    }
}

customElements.define('zoom-slider', ZoomSlider);
