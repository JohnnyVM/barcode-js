class CustomDrawer extends HTMLElement {
    constructor() {
        super();
        const drawerContent = document.createElement('div');
        drawerContent.classList.add('drawer-content');
        drawerContent.innerHTML = `
            <h2>Menu</h2>
            <ul>
                <li><button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" onclick="reportError()">Report Error</button></li>
                <li><button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" onclick="takeSampleImage()">Take Sample Image</button></li>
                <li><button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" id="close-drawer-button">Close</button></li>
            </ul>
        `;
        this.appendChild(drawerContent);

        this.closeButton = this.querySelector('#close-drawer-button');
        this.closeButton.addEventListener('click', () => this.hide());
    }

    show() {
        this.style.display = 'flex';
    }

    hide() {
        this.style.display = 'none';
    }
}

customElements.define('custom-drawer', CustomDrawer);

function reportError() {
    alert('Report Error clicked!');
}

function takeSampleImage() {
    alert('Take Sample Image clicked!');
}

export default CustomDrawer;
