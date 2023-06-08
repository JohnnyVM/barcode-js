import { Settings } from '../utils.js';
import { scanImage, ZBar } from './lib.js'
import Module from './zbar.js'

let modZBar = null

var cameraWorker = new Blob([
	"self.onmessage = function(e) {self.postMessage('msg from worker');};"
], { type: "text/javascript" })

function drawPoly(ctx, poly) {
// drawPoly expects a flat array of coordinates forming a polygon (e.g. [x1,y1,x2,y2,... etc])
	ctx.beginPath();
	ctx.moveTo(poly[0], poly[1]);
	for (let item = 2; item < poly.length - 1; item += 2) { ctx.lineTo(poly[item], poly[item + 1]) }

	ctx.lineWidth = 2;
	ctx.strokeStyle = "#FF0000";
	ctx.closePath();
	ctx.stroke();
}

// render the string contained in the barcode as text on the canvas
function renderData(ctx, data, x, y) {
	ctx.font = "15px Arial";
	ctx.fillStyle = "red";
	ctx.fillText(data, x, y);
}

class BarcodeReader extends HTMLElement {
	settings = null;
	#camera;
	#displayCamera = { canvas: null, crop: null };

	/**
	 * Calculate the apropiate display position witha a image centred
	 *
	 * @param {MediaTrackSettings} Camera settings
	 *
	 * @return {DOMRect} Rectangle indicating the correct position
	 */
	#calculateDisplayCameraSection(cameraSettings) {
		let x = 0;
		let y = 0;
		let boundaries = this.getBoundingClientRect();
		if(boundaries.width < cameraSettings.width) {
			x = Math.floor( cameraSettings.width / 2 - boundaries.width / 2 );
		}
		return new DOMRect(x, y, boundaries.width, boundaries.height);
	}

	async #startDisplay(time) {
		const boundaries = this.#displayCamera.crop;
		const ctx = this.#displayCamera.canvas.getContext('2d', { willReadFrequently: true, alpha: false });
		let img = await createImageBitmap(this.#camera, boundaries.x, boundaries.y, boundaries.width, boundaries.height);
		ctx.drawImage(img, 0, 0);
		// --------------------------------------
	    const image = ctx.getImageData(0, 0, boundaries.width, boundaries.height);
		let barcodes = await scanImage(image);
		// ------------------------------------------------
		window.requestAnimationFrame(() => { this.#startDisplay(); });
	}

	/**
	 * display the cropped image
	 *
	 * @param {DOMRect} Camera settings
	 */
	async play() {
		// --------------------------------------
		if(modZBar === null) {
			modZBar = await ZBar.getInstance();
			const ctx = this.#displayCamera.canvas.getContext('2d', { willReadFrequently: true, alpha: false });
			let pl = document.querySelector('product-list');

			// set the function that should be called whenever a barcode is detected
			modZBar['processResult'] = async (symbol, data, polygon) => {
				pl.addProduct(data);

				// draw the bounding polygon
				drawPoly(ctx, polygon)

				// render the data at the first coordinate of the polygon
				renderData(ctx, data, polygon[0], polygon[1] - 10)
			}
		}

		// ------------------------------------------------
		this.#camera.addEventListener('loadeddata', async () => {
			this.#startDisplay();
		}, { once: true });
	}

    set srcObject(stream) {
		const track = stream.getVideoTracks()[0];
		const actualSettings = track.getSettings();

		this.#displayCamera.crop = this.#calculateDisplayCameraSection(actualSettings);
		this.#displayCamera.canvas.width = this.#displayCamera.crop.width;
		this.#displayCamera.canvas.height = this.#displayCamera.crop.height;

        this.#camera.srcObject = stream;
    }

	static get observedAttributes() {
		return ['width', 'height'];
	}

    attributeChangedCallback(attrName, oldVal, newVal) {
        if(attrName == 'width') {
            this.mainCanvas.width = newVal;
            return;
        }
        if(attrName == 'height') {
            this.mainCanvas.height = newVal;
            return;
        }
    }

    constructor() {
        super();
		this.settings = new Settings();

        // Create a shadow root
        this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'

   		this.#camera = document.createElement("video");
		this.#camera.setAttribute('autoplay', 1);
		this.#camera.style.display = 'none';

		this.#displayCamera.canvas = document.createElement("canvas");

		//remove
		this.mainCanvas = document.createElement("canvas");
        this.ctx = this.mainCanvas.getContext("2d", {willReadFrequently: true});

        // Apply external styles to the shadow DOM
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "module/barcode-detector/style.css");

        this.shadowRoot.append(linkElem, this.#camera, this.#displayCamera.canvas);

        this.constructor.observedAttributes.forEach(element => {
            let attribute = this.getAttribute(element);
            if (attribute !== null) {
                this.attributeChangedCallback(element, null, attribute);
            }
        });
    }
}

export { BarcodeReader };
