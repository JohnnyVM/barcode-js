// customCartItems.js
export class CartItem extends HTMLElement {
    constructor(item) {
        super();
        this.name = item.name;
        this.price = item.lst_price;
        this.barcode = item.barcode;
        this.quantity = item.quantity;
        this.attachShadow({ mode: 'open' });
        const displayPrice =  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(item.lst_price)
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
            <style>
                .cart-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px;
                    border-bottom: 1px solid #ccc;
                    font-size: 14px;
                }
                .item-info {
                    flex: 1;
                }
                .item-info .name {
                    color: white;
                    background-color: #3f51b5;
                    font-weight: bold;
                    padding: 8px;
                }
                .item-controls {
                    display: flex;
                    align-items: center;
                }
                .quantity {
                    margin: 0 10px;
                }
                button {
                    background: none;
                    border: none;
                    color: #3f51b5;
                    cursor: pointer;
                    font-size: 18px;
                    padding: 5px;
                }
                .quantity-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background-color: #2196f3;
                    color: white;
                }
            </style>
            <div class="cart-item">
                <div class="item-info">
                    <div class="name">${this.name}</div>
                    <div>Price: $${displayPrice}</div>
                    <div>Barcode: ${this.barcode}</div>
                </div>
                <!--div class="item-controls">
                    <button id="decrease" class="quantity-button">&ndash;</button>
                    <div class="quantity">${this.quantity}</div>
                    <button id="increase" class="quantity-button">+</button>
                </div-->
            </div>
        `;

        /*this.shadowRoot.querySelector('#increase').addEventListener('click', () => {
            this.quantity++;
            this.updateQuantity();
        });

        this.shadowRoot.querySelector('#decrease').addEventListener('click', () => {
            if (this.quantity > 1) {
                this.quantity--;
                this.updateQuantity();
            } else {
                this.dispatchEvent(new CustomEvent('remove-item', {
                    detail: { barcode: this.barcode },
                    bubbles: true,
                    composed: true
                }));
            }
        });*/
    }

    updateQuantity() {
        this.shadowRoot.querySelector('.quantity').textContent = this.quantity;
        this.dispatchEvent(new CustomEvent('update-quantity', {
            detail: { barcode: this.barcode, quantity: this.quantity },
            bubbles: true,
            composed: true
        }));
    }
}


customElements.define('cart-items', CartItem);