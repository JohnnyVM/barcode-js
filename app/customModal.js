class CustomModal extends HTMLElement {
    constructor() {
        super();
        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');
        modalContent.innerHTML = `
            <h2>Cart Items</h2>
            <ul id="cart-items">
                <!-- Cart items will be dynamically added here -->
            </ul>
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" id="close-button">Close</button>
        `;
        this.appendChild(modalContent);

        this.closeButton = this.querySelector('#close-button');
        this.closeButton.addEventListener('click', () => this.hide());
    }

    show() {
        this.style.display = 'flex';
    }

    hide() {
        this.style.display = 'none';
    }
}

customElements.define('custom-modal', CustomModal);
