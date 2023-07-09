import { Settings } from '../utils.js';
import { scanImage, ZBar } from './lib.js'

let modZBar = null;
let timeout = null;


function drawPoly(canva, poly) {
	const ctx = canva.getContext('2d');

	if(!timeout) {
		clearTimeout(timeout);
		ctx.clearRect(0, 0, canva.width, canva.height);
		timeout = null;
	}
	// drawPoly expects a flat array of coordinates forming a polygon (e.g. [x1,y1,x2,y2,... etc])
	ctx.beginPath();
	ctx.moveTo(poly[0], poly[1]);
	for (let item = 2; item < poly.length - 1; item += 2) { ctx.lineTo(poly[item], poly[item + 1]) }

	ctx.lineWidth = 2;
	ctx.strokeStyle = "#FF0000";
	ctx.closePath();
	ctx.stroke();
	setTimeout(() => {
		ctx.clearRect(0, 0, canva.width, canva.height);
		timeout = null;
	}, 1000);
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
	#displayCamera;
	#imageCrop;
	#imageScale;
	#barcodeGuide;
	#barcodeDisplay;

	/**
	 * Calculate the apropiate display position with a image centred
	 * The displayed image is the 20% of the image if boundaries width < 20% image width
	 *
	 * @param {DOMRect} boundaries - Camera settings
	 * @param {MediaDisplay} imageSize - Camera settings
	 *
	 * @return {DOMRect} Rectangle indicating the correct position
	 */
	#calculateImageSection(boundaries, cameraSize) {
		let x = 0;
		let y = 0;
		let width = boundaries.width;
		let height = boundaries.height;
		const referenceBoundaryWidth = 400;
		const referenceImageWidth = 1920;
		let scale = 1;
		if(boundaries.width > cameraSize.width) {
			// TODO center image
			return {crop: new DOMRect(x, y, width, height), scale: [1, 1]};
		}
		// TODO avoid magic numbers
		if((referenceBoundaryWidth/referenceImageWidth) < (boundaries.width/cameraSize.width)) {
			x = Math.floor( cameraSize.width / 2 - width / 2 );
			return {crop: new DOMRect(x, y, width, height), scale: [1, 1]};
		}
		width = referenceBoundaryWidth/referenceImageWidth * cameraSize.width;
		x = Math.floor( width / 2 - boundaries.width / 2 );
		scale = boundaries.width / width;
		return {crop: new DOMRect(x, y, width, height), scale: [scale, scale]};
	}

	#drawGuide() {
		let ctx = this.#barcodeGuide.getContext("2d");
		ctx.strokeStyle = '#ff0000';
		ctx.beginPath();
		ctx.moveTo(this.#barcodeGuide.width / 10, this.#barcodeGuide.height / 2);
		ctx.lineTo(this.#barcodeGuide.width * 9 / 10, this.#barcodeGuide.height / 2);
		ctx.stroke();
	}

	async #startDisplay() {
		try {
			// get ImageBitmap (cropped)
			const boundaries = this.#imageCrop;
			const ctx = this.#displayCamera.getContext('2d', { willReadFrequently: true, alpha: false });
			let img = await createImageBitmap(this.#camera, boundaries.x, boundaries.y, boundaries.width, boundaries.height);
			ctx.drawImage(img, 0, 0);
			// --------------------------------------
			const image = ctx.getImageData(0, 0, boundaries.width, boundaries.height);
			await scanImage(image);
			// ------------------------------------------------
		} finally {
			window.requestAnimationFrame(() => { this.#startDisplay(); });
		}
	}

	/**
	 * display the cropped image
	 *
	 * @param {DOMRect} Camera settings
	 */
	async play() {
		// ------------------------------------
		if(modZBar === null) {
			modZBar = await ZBar.getInstance();
			const ctx = this.#displayCamera.getContext('2d', { willReadFrequently: true, alpha: false });
			let pl = document.querySelector('product-list');

			// set the function that should be called whenever a barcode is detected
			modZBar['processResult'] = async (symbol, data, polygon) => {
				await pl.addProduct(data);

				// draw the bounding polygon
				drawPoly(this.#barcodeDisplay, polygon)

				// render the data at the first coordinate of the polygon
				renderData(ctx, data, polygon[0], polygon[1] - 10)
			}
		}
		// ------------------------------------

		this.#startDisplay();
	}

    set srcObject(stream) {
		let boundaries = this.getBoundingClientRect();
		this.setAttribute('width', boundaries.width);
		this.setAttribute('height', boundaries.height);
		const track = stream.getVideoTracks()[0];
		const cameraSettings = track.getSettings();
		let {crop, scale} = this.#calculateImageSection(boundaries, cameraSettings);
		this.#imageCrop = crop;
		this.#imageScale = scale;
		this.#drawGuide();

        this.#camera.srcObject = stream;
    }

	static get observedAttributes() {
		return ['width', 'height'];
	}

    attributeChangedCallback(attrName, oldVal, newVal) {
		const scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
		const ctx = this.#barcodeDisplay.getContext('2d', {willReadFrequently: true})
        if(attrName == 'width') {
            this.#camera.width = newVal;
            this.#displayCamera.width = newVal;
            this.#barcodeGuide.width = newVal;
            this.#barcodeDisplay.style.width = `${newVal}px`;
			this.#barcodeDisplay.width = Math.floor(newVal * scale);
			ctx.scale(scale, scale)
            return;
        }
        if(attrName == 'height') {
            this.#camera.height = newVal;
            this.#displayCamera.height = newVal;
            this.#barcodeGuide.height = newVal;
            this.#barcodeDisplay.style.height = `${newVal}px`;
			this.#barcodeDisplay.height = Math.floor(newVal * scale);
			ctx.scale(scale, scale)
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

		this.#displayCamera = document.createElement("canvas");
		this.#displayCamera.id = 'display-camera';

		this.#barcodeGuide = document.createElement("canvas");
		this.#barcodeGuide.id = 'barcode-guide';

		this.#barcodeDisplay = document.createElement("canvas");
		this.#barcodeDisplay.id = 'barcode-display';

        // Apply external styles to the shadow DOM
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "module/barcode-detector/style.css");

        this.shadowRoot.append(
			linkElem,
			this.#camera,
			this.#displayCamera,
			this.#barcodeDisplay,
			this.#barcodeGuide);

        this.constructor.observedAttributes.forEach(element => {
            let attribute = this.getAttribute(element);
            if (attribute !== null) {
                this.attributeChangedCallback(element, null, attribute);
            }
        });
    }
}

export { BarcodeReader };
