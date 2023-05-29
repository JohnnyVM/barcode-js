import { BarcodeReader } from './module/barcode-reader/ui.mjs';

customElements.define("barcode-reader", BarcodeReader);

let MediaRequirements = {
    video: {
        facingMode: "environment",
    }
};

navigator.mediaDevices.getUserMedia(MediaRequirements).then(function(stream) {
	// tell the canvas which resolution we ended up getting from the webcam
	const track = stream.getVideoTracks()[0];
	const actualSettings = track.getSettings();
	console.log(actualSettings.width, actualSettings.height);
    let barcode = document.getElementsByTagName('barcode-reader')[0];
    barcode.setAttribute('width', actualSettings.width);
    barcode.setAttribute('height', actualSettings.height);
    barcode.srcObject = stream;
	return barcode.show();
});
