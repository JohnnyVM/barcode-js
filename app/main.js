import { BarcodeReader } from './module/barcode-detector/ui.js';
import { ProductList, ProductCard } from './module/product/ui.js';

customElements.define("barcode-reader", BarcodeReader);
customElements.define("product-list", ProductList);
customElements.define("product-card", ProductCard);

let MediaRequirements = {
    video: {
        facingMode: "environment",
    }
};

async function asyncInterval(fn) {
  return await new Promise(resolve => {
    const interval = setInterval(() => {
		fn();
        clearInterval(interval);
    }, 333);
  });
}

navigator.mediaDevices.getUserMedia(MediaRequirements).then(function(stream) {
    let barcode = document.getElementsByTagName('barcode-reader')[0];

    barcode.srcObject = stream;
	setInterval(async () => {
			await barcode.display();
	}, 300);
});
