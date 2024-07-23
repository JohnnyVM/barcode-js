// cart.js
export class Cart {
    constructor() {
        this.items = [];
    }

    addItem(item) {
        const existingItem = this.items.find(i => i.barcode === item.barcode);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push({ ...item, quantity: 1 });
            // Music
        }
    }

    removeItem(barcode) {
        this.items = this.items.filter(item => item.barcode !== barcode);
    }

    updateItemQuantity(barcode, quantity) {
        const item = this.items.find(i => i.barcode === barcode);
        if (item) {
            item.quantity = quantity;
        }
    }

    getItems() {
        return this.items;
    }

    clearCart() {
        this.items = [];
    }
}
