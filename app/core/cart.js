// cart.js

export class Cart {
    constructor() {
        this.items = {};
    }

    addItem(item) {
        if (this.items[item.rawValue]) {
            this.items[item.rawValue].quantity += 1;
        } else {
            this.items[item.rawValue] = { ...item, quantity: 1 };
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

