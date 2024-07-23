export class BarcodeHandler {
    /**
     * Creates an instance of BarcodeHandler.
     *
     * @constructor
     * @param {*} apiUrl
     */
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }

    /**
     * Description placeholder
     *
     * @async
     * @param {*} barcode
     * @returns {*}
     */
    async handleBarcodeDetected(barcodes) {
        try {
            for (const barcode of barcodes) {
                const response = await fetch(new URL('/product/' + barcode.rawValue, this.apiUrl));
                const product = await response.json();
                this.addProductToCart(product);
            }
        } catch (error) {
            console.error('Failed to fetch product data:', error);
        }
    }

    /**
     * Description placeholder
     *
     * @async
     * @param {*} product
     * @returns {*}
     */
    async addProductToCart(products) {
        for (const product of products) {
            const cartDialog = document.querySelector('cart-list');
            cartDialog.addItemToCart(product);
            cartDialog.renderCartItems()
        }
    }
}
