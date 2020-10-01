import { LitElement, html } from 'lit-element'
import { bannerStyles } from './styles'

class TdConsentBanner extends LitElement {
  static get styles () {
    return [ bannerStyles ]
  }

  static get properties () {
    return {
      bannerContent: { type: String },
      bannerSubContent: { type: String }
    }
  }
  constructor () {
    super()

    this.bannerContent = ''
    this.bannerSubContent = ''
  }

  handleClick (event) {
    const target = event.composedPath()[0]

    if (target.nodeName === 'BUTTON') {
      event.stopPropagation()
      this.dispatchEvent(new Event('cancelBanner'))
      this.dispose()
    }
  }

  dispose () {
    this.parentNode && this.parentNode.removeChild(this)
  }

  render () {
    return html`
      <div class="consent-popup">
        <button class="cancel-btn cancel" @click=${this.handleClick}>x</button>
        <div class="description">${this.bannerContent}</div>
        <div name="preferences">
          <a href="#">${this.bannerSubContent}</a>
        </div>
      </div>
    `
  }
}

if (!customElements.get('td-consent-banner')) {
  customElements.define('td-consent-banner', TdConsentBanner)
}
