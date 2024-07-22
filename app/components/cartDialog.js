// customCartDialog.js
import { Cart } from '../core/cart.js';

export class CartDialog extends HTMLElement {
    /**
     * Cart
     * @type {Cart}
     */
    cart

    constructor() {
        super();
        this.cart = new Cart();
        const dialog = document.createElement('dialog');
        dialog.classList.add('mdl-dialog');
        dialog.innerHTML = `
            <h4 class="mdl-dialog__title">Cart</h4>
            <div class="mdl-dialog__content">
                <ul id="cart-items">
                    <p>Your cart is empty.</p>
                </ul>
            </div>
            <div class="mdl-dialog__actions">
                <button type="button" id="clear-cart" class="mdl-button">Clear Cart</button>
                <button type="button" class="mdl-button close">Close</button>
            </div>
        `;
        this.appendChild(dialog);

        this.querySelector('.close').addEventListener('click', () => {
            this.closeDialog();
        });

        this.querySelector('#clear-cart').addEventListener('click', () => {
            this.cart.clearCart();
            this.renderCartItems();
        });
    }

    showDialog() {
        const dialog = this.querySelector('dialog');
        dialog.showModal();
    }

    closeDialog() {
        const dialog = this.querySelector('dialog');
        dialog.close();
    }

    addItemToCart(item) {
        this.cart.addItem(item);
        this.renderCartItems();
    }

    renderCartItems() {
        const cartItemsContainer = this.querySelector('#cart-items');
        cartItemsContainer.innerHTML = '';

        const items = this.cart.getItems();
        if (items.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            items.forEach(item => {
                const itemElement = document.createElement('li');
                itemElement.textContent = `${item.rawValue} - Quantity: ${item.quantity}`;
                cartItemsContainer.appendChild(itemElement);
            });
        }
    }
}

customElements.define('cart-dialog', CartDialog);

