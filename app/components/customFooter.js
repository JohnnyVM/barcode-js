// customFooter.js
export class CustomFooter extends HTMLElement {
    constructor() {
        super();
        const footer = document.createElement('footer');
        footer.classList.add('custom-footer');
        footer.innerHTML = `
            <img src="../static/img/company-icon.ico" class="company-icon" alt="Company Icon"> <span>v0.3</span>
        `;
        this.appendChild(footer);
    }
}

customElements.define('custom-footer', CustomFooter);

