// customFooter.js
export class CustomFooter extends HTMLElement {
    constructor() {
        super();
        const footer = document.createElement('footer');
        footer.classList.add('custom-footer');
        footer.innerHTML = `
            <img src="company-icon.png" class="company-icon" alt="Company Icon"> <span>v0.2</span>
        `;
        this.appendChild(footer);
    }
}

customElements.define('custom-footer', CustomFooter);

