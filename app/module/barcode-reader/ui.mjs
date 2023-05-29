class BarcodeReader extends HTMLElement {

    set srcObject(stream) {
        this.video.srcObject = stream;
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

    show() {
        this.ctx.drawImage(this.video, 0, 0);

	    // get the image data from the canvas
	    const image = this.ctx.getImageData(0, 0, canvas.width, canvas.height)

    	// convert the image data to grayscale 
        const grayData = []
        const d = image.data;
        for (var i = 0, j = 0; i < d.length; i += 4, j++) {
            grayData[j] = (d[i] * 66 + d[i + 1] * 129 + d[i + 2] * 25 + 4096) >> 8;
        }

        this.ctx.putImageData(grayData, 0, 0);

        requestAnimationFrame(() => this.show());
    }

    constructor() {
        super();
        // Create a shadow root
        this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'
        this.mainCanvas = document.createElement("canvas");
        this.ctx = this.mainCanvas.getContext("2d");

        this.video = document.createElement("video");
        this.video.style = "display:none;";

        // Apply external styles to the shadow DOM
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "module/barcode-reader/style.css");

        this.shadowRoot.append(linkElem, this.mainCanvas, this.video);

        this.constructor.observedAttributes.forEach(element => {
            let attribute = this.getAttribute(element);
            if (attribute !== null) {
                this.attributeChangedCallback(element, null, attribute);
            }
        });

        this.show();
    }
}

export { BarcodeReader };