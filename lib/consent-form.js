import { LitElement, html } from 'lit-element'

import { formStyles } from './styles'

const LABEL_ALLOW = 'Allow'
const LABEL_PURPOSE = 'Purpose'
const LABEL_DESC = 'Description'
const LABEL_DATATYPE = 'Data Type'

class TdConsentForm extends LitElement {
  static get styles () {
    return [formStyles]
  }

  static get properties () {
    return {
      dialogTitle: { type: String },
      dialogDescription: { type: String },
      cancelButtonText: { type: String },
      saveButtonText: { type: String },
      preferences: { type: Object },
      consentStates: { type: Object }
    }
  }
  constructor () {
    super()

    this.preferences = {}
  }

  connectedCallback () {
    super.connectedCallback()

    setTimeout(() => {
      this.registerEvents()
    }, 0)
  }

  disconnectedCallback () {
    super.disconnectedCallback()

    this.unregisterEvents()
  }

  handleClick (event) {
    const target = event.composedPath()[0]

    if (target.nodeName === 'BUTTON') {
      this.handleAction(target)
    } else if (target.nodeName === 'INPUT' && target.type === 'radio') {
      const { name, value } = target
      const contextId = target.getAttribute('data-cid')
      const purpose = target.getAttribute('data-purpose')

      var updateEvent = new CustomEvent('selectionChange', {
        bubbles: true,
        detail: { name, value, purpose, contextId }
      })

      this.dispatchEvent(updateEvent)
    }
  }

  registerEvents () {
    var radios = this.querySelectorAll('input[type="radio"]')
    if (!radios || !radios.length) {
      radios = this.shadowRoot.querySelectorAll('input[type="radio"]')
    }

    radios.forEach(radio =>
      radio.addEventListener('click', this.handleClick.bind(this))
    )
  }

  unregisterEvents () {
    var radios = this.querySelectorAll('input[type="radio"]')
    if (!radios || !radios.length) {
      radios = this.shadowRoot.querySelectorAll('input[type="radio"]')
    }

    radios.forEach(radio =>
      radio.removeEventListener('click', this.handleClick.bind(this))
    )
  }

  handleAction (target) {
    if (target.classList.contains('submit')) {
      this.saveSettings()
    } else {
      this.dispatchEvent(new Event('cancelForm'))
    }
  }

  dispose () {
    this.parentNode && this.parentNode.removeChild(this)
  }

  saveSettings () {
    this.dispatchEvent(new Event('saveForm'))
  }

  render () {
    return html`
      <div class="dialog-content">
        <div class="dialog-title">
          <h3>${this.dialogTitle}</h3>
          <button class="cancel-btn cancel" @click=${this.handleClick}>x</button>
        </div>
        <div class="dialog-description">
          ${this.dialogDescription}
        </div>
        <div class="dialog-consents">
          ${this.renderContexts()}
        </div>
        <div class="dialog-actions">
          <button class="secondary cancel" @click=${this.handleClick}>${this.cancelButtonText}</button>
          <button class="primary submit" @click=${this.handleClick}>${this.saveButtonText}</button> </div>
      </div>
    `
  }

  renderContexts () {
    return Object.keys(this.preferences).map(contextId => {
      return this.renderContext(this.preferences[contextId])
    })
  }

  renderContext (context) {
    return html`
      <div class="context-wrapper">
        <h3>Context scope: ${context.collection_type}</h3>
        <table>
          <thead>
            <tr>
              <th>${LABEL_ALLOW}</th>
              <th>${LABEL_PURPOSE}</th>
              <th>${LABEL_DESC}</th>
              <th>${LABEL_DATATYPE}</th>
            </tr>
          </thead>
          <tbody>
            ${this.renderConsents(context.consents)}
          </tbody>
        </table>
      </div>
    `
  }

  renderConsents (consents = {}) {
    var keys = Object.keys(consents)
    return (keys || []).map(key => {
      var consent = consents[key]
      return html`
        <tr>
          <td>
            ${!consents[key].default ? this.getInputs(consent.context_id, key, consent.key, consent.status) : ''}
          </td>
          <td>${key}</td>
          <td>${consents[key]['description'] || ''}</td>
          <td>${consents[key]['datatype'] || ''}</td>
        </tr>
      `
    })
  }

  getInputs (contextId, name, inputName, status) {
    return [
      html`<label> ${this.getInput(contextId, name, inputName, status, this.consentStates.GIVEN)} Yes </label>`,
      html`<label> ${this.getInput(contextId, name, inputName, status, this.consentStates.REFUSED)} No </label>`
    ]
  }

  getInput (contextId, name, inputName, preferStatus, status) {
    if (preferStatus.toLowerCase() === status.toLowerCase()) {
      return html`
        <input type="radio" name=${`${contextId}-${inputName}`} data-purpose=${name} data-cid=${contextId} value=${String(status)} checked>
      `
    }

    return html`
      <input type="radio" name=${`${contextId}-${inputName}`} data-purpose=${name} data-cid=${contextId} value=${String(status)}>
    `
  }
}

if (!customElements.get('td-consent-form')) {
  customElements.define('td-consent-form', TdConsentForm)
}
