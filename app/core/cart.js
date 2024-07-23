// cart.js

export class Cart {
    constructor() {
        this.items = {};
    }

    addItem(item) {
        if (this.items[item.barcode]) {
            this.items[item.barcode].quantity += 1;
        } else {
            this.items[item.barcode] = { ...item, quantity: 1 };
        }
    }

    removeItem(itemId) {
        delete this.items[itemId];
    }

    clearCart() {
        this.items = {};
    }

    getItems() {
        return Object.values(this.items);
    }
}

