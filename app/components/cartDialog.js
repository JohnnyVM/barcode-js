// customCartDialog.js
import './cartItem.js';
import { Cart } from '../core/cart.js';

export class CartDialog extends HTMLElement {
    constructor() {
        super();
        this.cart = new Cart();
        
        const dialog = document.createElement('dialog');
        dialog.classList.add('mdl-dialog');
        dialog.innerHTML = `
            <h4 class="mdl-dialog__title">Cart</h4>
            <div class="mdl-dialog__content">
                <cart-items id="cart-items"></cart-items>
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
        const cartItemsElement = this.querySelector('#cart-items');
        cartItemsElement.items = this.cart.getItems();
    }
}

customElements.define('cart-dialog', CartDialog);
