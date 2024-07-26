// customFooter.js
export class CustomFooter extends HTMLElement {
    handleIconClick() {
        document.querySelector('settings-dialog#modal-settings').show();
    }

    constructor() {
        super();
        const footer = document.createElement('footer');
        footer.classList.add('custom-footer');
        footer.innerHTML = `
          <button class="mdl-button mdl-js-button mdl-button--accent">
            <img src="../static/img/company-icon.png" class="company-icon" alt="Company Icon">
          </button>
          <span>v0.4</span>
        `;
        this.appendChild(footer);

        this.iconButton = this.querySelector('.company-icon');

        this.iconButton.addEventListener('click', this.handleIconClick.bind(this));
    }
}

customElements.define('custom-footer', CustomFooter);

