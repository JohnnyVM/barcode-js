import { BarcodeReader } from './module/barcode-detector/ui.js';
import { ProductList, ProductCard } from './module/product/ui.js';
import { identifyDevice } from './module/utils.js';

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

let clearButton = document.querySelector('#clear-list-button');
clearButton.addEventListener('click', ()=>{
	let productList = document.getElementsByTagName('product-list')[0];
	productList.deleteProductCards();
});

navigator.mediaDevices.getUserMedia(MediaRequirements).then(async function(stream) {
    let barcode = document.getElementsByTagName('barcode-reader')[0];
	identifyDevice(stream);
    barcode.srcObject = stream;
	await barcode.play();
});
