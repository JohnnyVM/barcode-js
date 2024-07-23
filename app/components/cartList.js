// customCartList.js
import './cartItem.js';
import { Cart } from '../core/cart.js';

export class CartList extends HTMLElement {
    constructor() {
        super();
        this.cart = new Cart();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.indigo-pink.min.css">
            <style>
                :host {
                    display: block;
                    padding: 10px;
                    background-color: #f5f5f5;
                    overflow-y: auto;
                    max-height: 400px;
                }
            </style>
            <cart-items id="cart-items"></cart-items>
            <button id="clear-cart" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">
                Clear Cart
            </button>
        `;

        this.shadowRoot.querySelector('#clear-cart').addEventListener('click', () => {
            this.cart.clearCart();
            this.renderCartItems();
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
        const cartItemsElement = this.shadowRoot.querySelector('#cart-items');
        cartItemsElement.items = this.cart.getItems();
    }
}

customElements.define('cart-list', CartList);
