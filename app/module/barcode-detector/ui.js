import { Settings } from '../utils.js';
import { scanImage, ZBar } from './lib.js'
import Module from './zbar.js'

let modZBar = null

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

    set srcObject(stream) {
        this.video.srcObject = stream;

		const track = stream.getVideoTracks()[0];
		const actualSettings = track.getSettings();
		console.log(actualSettings.width, actualSettings.height)
		this.mainCanvas.width = actualSettings.width;
		this.mainCanvas.height = actualSettings.height;

        this.video.play();
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

	async display() {
		if(modZBar === null) {
			modZBar = await ZBar.getInstance();
			let pl = document.querySelector('product-list');

			// set the function that should be called whenever a barcode is detected
			modZBar['processResult'] = async (symbol, data, polygon) => {
				pl.addProduct(data);

				// draw the bounding polygon
				drawPoly(this.ctx, polygon)

				// render the data at the first coordinate of the polygon
				renderData(this.ctx, data, polygon[0], polygon[1] - 10)
			}
		}
        this.ctx.drawImage(this.video, 0, 0);

	    // get the image data from the canvas
	    const image = this.ctx.getImageData(0, 0, this.mainCanvas.width, this.mainCanvas.height)

		let barcodes = await scanImage(image);
    }

    constructor() {
        super();
		this.settings = new Settings();

        // Create a shadow root
        this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'
        let wrapper = document.createElement("div");
		wrapper.classList.add('barcode');
        	this.mainCanvas = document.createElement("canvas");
        	this.ctx = this.mainCanvas.getContext("2d", {willReadFrequently: true});

        	this.video = document.createElement("video");
		wrapper.append(this.video, this.mainCanvas)

        // Apply external styles to the shadow DOM
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "module/barcode-detector/style.css");

        this.shadowRoot.append(linkElem, wrapper);

        this.constructor.observedAttributes.forEach(element => {
            let attribute = this.getAttribute(element);
            if (attribute !== null) {
                this.attributeChangedCallback(element, null, attribute);
            }
        });
    }
}

export { BarcodeReader };
