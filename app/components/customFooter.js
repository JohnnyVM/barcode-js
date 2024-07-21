/**
 * ${1:Description placeholder}
 *
 * @class CustomFooter
 * @typedef {CustomFooter}
 * @extends {HTMLElement}
 */
class CustomFooter extends HTMLElement {
    /**
     * Creates an instance of CustomFooter.
     *
     * @constructor
     */
    constructor() {
        super();
        const footer = document.createElement('footer');
        footer.classList.add('custom-footer');
        footer.innerHTML = `
            <img src="company-icon.png" class="company-icon" alt="Company Icon">
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent cart-button">
                Cart <span class="badge">0</span>
            </button>
            <button class="mdl-button mdl-js-button mdl-button--icon mdl-button--accent">
                <i class="material-icons">menu</i>
            </button>
        `;
        this.appendChild(footer);

        this.cartButton = this.querySelector('.cart-button');
        this.menuButton = this.querySelector('.mdl-button--icon');

        this.cartButton.addEventListener('click', this.handleCartClick.bind(this));
        this.menuButton.addEventListener('click', this.handleMenuClick.bind(this));
    }

    /** ${1:Description placeholder} */
    handleCartClick() {
        document.querySelector('custom-modal#cart-modal').show();
    }

    /** ${1:Description placeholder} */
    handleMenuClick() {
        document.querySelector('custom-drawer#menu-drawer').show();
    }
}

customElements.define('custom-footer', CustomFooter);
export default CustomFooter;
