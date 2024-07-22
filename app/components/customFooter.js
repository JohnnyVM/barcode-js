/**
 * ${1:Description placeholder}
 *
 * @class CustomFooter
 * @typedef {CustomFooter}
 * @extends {HTMLElement}
 */
export class CustomFooter extends HTMLElement {
  /**
   * Creates an instance of CustomFooter.
   *
   * @constructor
   */
  constructor () {
    super()
    const footer = document.createElement('footer')
    footer.classList.add('custom-footer')
    footer.innerHTML = `
        <img src="company-icon.png" class="company-icon" alt="Company Icon">
      `
    this.appendChild(footer)
  }

}

customElements.define('custom-footer', CustomFooter)
