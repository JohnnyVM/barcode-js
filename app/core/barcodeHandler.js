// src/core/barcodeHandler.js
export class BarcodeHandler {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }

    async handleBarcodeDetected(barcode) {
        try {
            const response = await fetch(`${this.apiUrl}/${barcode}`);
            const product = await response.json();
            this.addProductToCart(product);
        } catch (error) {
            console.error('Failed to fetch product data:', error);
        }
    }

    async addProductToCart(product) {
        // Example: Adding product to cart
        console.log(`Adding product to cart: ${product.name} - $${product.price}`);
        // Integrate with actual cart management
    }
}
