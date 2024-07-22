// customFooter.js
export class CustomFooter extends HTMLElement {
    constructor() {
        super();
        const footer = document.createElement('footer');
        footer.classList.add('custom-footer');
        footer.innerHTML = `
            <img src="company-icon.png" class="company-icon" alt="Company Icon">
            <button id="cart-button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">Cart</button>
            <button id="menu-button" class="mdl-button mdl-js-button mdl-button--icon">
                <i class="material-icons">more_vert</i>
            </button>
        `;
        this.appendChild(footer);

        // Event listener for cart button
        this.querySelector('#cart-button').addEventListener('click', () => {
            const cartDialog = document.querySelector('cart-dialog');
            cartDialog.showDialog();
        });
    }
}

customElements.define('custom-footer', CustomFooter);

