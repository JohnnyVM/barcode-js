// customFooter.js
/**
 * Description placeholder
 *
 * @export
 * @class CustomFooter
 * @typedef {CustomFooter}
 * @extends {HTMLElement}
 * 
 * @todo move innerHTML to shadowroot
 */
export class CustomFooter extends HTMLElement {
  barcodeScanner

  /** Description placeholder */
  handleIconClick() {
    document.querySelector('settings-dialog#modal-settings').show();
  }

  /**
   * Creates an instance of CustomFooter.
   *
   * @constructor
   */
  constructor(barcodeScanner) {
    super();
    const footer = document.createElement('footer');
    footer.classList.add('custom-footer');
    footer.innerHTML = `
          <button class="mdl-button mdl-js-button mdl-button--accent">
            <img src="../static/img/company-icon.png" class="company-icon" alt="Company Icon">
          </button>
          <span>v0.4</span>
          <button class="mdl-button mdl-js-ripple-effect mdl-js-button mdl-button--fab mdl-color--accent barcode-scanner" data-upgraded=",MaterialButton,MaterialRipple">
            <i class="material-icons mdl-color-text--white" role="presentation">barcode_scanner</i>
            <span class="material-symbols-outlined barcode-scanner">barcode_scanner</span>
          </button>
        `;
    this.appendChild(footer);

    this.iconButton = this.querySelector('.company-icon');

    this.iconButton.addEventListener('click', this.handleIconClick.bind(this));
  }
}

customElements.define('custom-footer', CustomFooter);

