import { BarcodeReader } from './module/barcode-detector/ui.js';
import { ProductList, ProductCard } from './module/product/ui.js';

customElements.define("barcode-reader", BarcodeReader);
customElements.define("product-list", ProductList);
customElements.define("product-card", ProductCard);

let MediaRequirements = {
  audio: false,
  video: {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    facingMode: "environment",
  }
};

navigator.mediaDevices.getUserMedia(MediaRequirements).then(async function(stream) {
    let barcode = document.getElementsByTagName('barcode-reader')[0];

    barcode.srcObject = stream;
	await barcode.play();
});
