// customCartItems.js
export class CartItems extends HTMLElement {
    constructor() {
        super();
    }

    set items(items) {
        this._items = items;
        this.renderItems();
    }

    renderItems() {
        this.innerHTML = '';

        if (this._items.length === 0) {
            this.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            const ul = document.createElement('ul');
            this._items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.rawValue} - Quantity: ${item.quantity}`;
                ul.appendChild(li);
            });
            this.appendChild(ul);
        }
    }
}

customElements.define('cart-items', CartItems);