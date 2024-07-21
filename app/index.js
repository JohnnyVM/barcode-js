import './customFooter.js';
import './videoContainer.js';
import './customModal.js';
import './customDrawer.js';
import './barcodeScanner.js';

document.addEventListener('DOMContentLoaded', () => {
    const videoContainer = document.querySelector('video-container');
    
    videoContainer.addEventListener('loadeddata', () => {
        const scanner = new BarcodeScanner(videoContainer.video);
        
        scanner.onBarcodeDetected = (barcode) => {
            console.log('Barcode detected:', barcode);
            // Handle barcode, e.g., add to cart
        };
        
        scanner.startScanning();
    });
});