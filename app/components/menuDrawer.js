/**
 * Menu drawer class
 *
 * @class MenuDrawer
 * @typedef {MenuDrawer}
 * @extends {HTMLElement}
 */
export class MenuDrawer extends HTMLElement {
  constructor () {
    super()
    const drawer = document.createElement('aside')
    drawer.classList.add('menu-drawer')
    drawer.innerHTML = `
            <div class="drawer-content">
                <h2>Menu</h2>
                <ul>
                    <li><button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">Report Error</button></li>
                    <li><button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">Take Example Image</button></li>
                </ul>
                <button class="mdl-button mdl-js-button mdl-button--icon mdl-button--accent close-button">
                    <i class="material-icons">close</i>
                </button>
            </div>
        `
    this.appendChild(drawer)

    this.closeButton = this.querySelector('.close-button')
    this.closeButton.addEventListener('click', () => this.close())
  }

  show () {
    this.style.display = 'block'
  }

  close () {
    this.style.display = 'none'
  }
}

customElements.define('custom-menu-drawer', MenuDrawer)
