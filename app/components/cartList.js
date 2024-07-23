// customCartList.js
import { CartItem } from './cartItem.js';
import { Cart } from '../core/cart.js';

export class CartList extends HTMLElement {
    constructor() {
        super();
        this.cart = new Cart();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
            <style>
                :host {
                    display: block;
                    padding: 10px;
                    background-color: #f5f5f5;
                    overflow-y: auto;
                    max-height: 100%;
                }
                h4 {
                    margin: 0 0 10px 0;
                    font-size: 16px;
                }
                #cart-items {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
            </style>
            <h4>Cart</h4>
            <div id="cart-items"></div>
        `;

        this.addEventListener('remove-item', (event) => {
            this.cart.removeItem(event.detail.barcode);
            this.renderCartItems();
        });

        this.addEventListener('update-quantity', (event) => {
            this.cart.updateItemQuantity(event.detail.barcode, event.detail.quantity);
        });
    }

    connectedCallback() {
        this.renderCartItems();
    }

    addItemToCart(item) {
        this.cart.addItem(item);
        this.renderCartItems();
    }

    renderCartItems() {
        const cartItemsContainer = this.shadowRoot.querySelector('#cart-items');
        cartItemsContainer.innerHTML = '';
        const items = this.cart.getItems();
        items.forEach(item => {
            const cartItemElement = new CartItem(item);
            cartItemsContainer.appendChild(cartItemElement);
        });
    }
}

customElements.define('cart-list', CartList);
