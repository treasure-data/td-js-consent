import './banner'
import './consent-form'

const DEFAULT_TITLE = 'Website Data Collection Preferences'
const DEFAULT_DESCRIPTION =
  'We use data collected by cookies and JavaScript libraries to improve your browsing experience, analyze site traffic, deliver personalized advertisements, and increase the overall performance of our site.'
const DEFAULT_CANCEL_TEXT = 'Cancel'
const DEFAULT_SAVE_TEXT = 'Save Settings'

function isObjectEmpty (obj) {
  return !obj || !Object.keys(obj).length
}

function assertSdk (sdk) {
  if (!sdk) throw new Error('TD JavaScript SDK is required. See `setConfig` for more details.')
}

function assertContainer (container) {
  if (!container) throw new Error('Container element is not specified.')
}

export default {
  _consentStates: {},
  _savedByForm: false,

  setConfig (options = {}) {
    this.config = options
  },

  _getContainer (selector) {
    if (typeof selector === 'string') {
      return document.querySelector(selector)
    } else if (selector && typeof selector === 'object') {
      return selector
    }

    return document.body
  },

  _saveConsents () {
    const {
      successConsentCallback,
      failureConsentCallback
    } = this.config.sdk.consentManager

    this.config.sdk.saveConsents(successConsentCallback, failureConsentCallback)

  },

  _openConsentBanner (container, options = {}) {
    container = container || document.body

    const { bannerContent = '', bannerSubContent = '' } = options

    this.consentBanner = document.createElement('td-consent-banner')
    this.consentBanner.setAttribute('id', 'td-consent-banner')
    this.consentBanner.bannerContent = bannerContent
    this.consentBanner.bannerSubContent = bannerSubContent

    this.consentBanner.addEventListener('click', this)
    this.consentBanner.addEventListener('cancelBanner', this)

    container.appendChild(this.consentBanner)
  },

  showBanner () {
    assertSdk(this.config.sdk)

    const container = this._getContainer(this.config.container)
    const {
      bannerContent = '',
      bannerSubContent = ''
    } = this.config

    this._openConsentBanner(container, { bannerContent, bannerSubContent })
  },

  openConsentManager (options = {}) {
    assertSdk(this.config.sdk)

    const container = this._getContainer(this.config.container)
    assertContainer(container)

    this._savedByForm = false

    const { customConsents = {} } = options
    const {
      dialogTitle = DEFAULT_TITLE,
      dialogDescription = DEFAULT_DESCRIPTION,
      cancelButtonText = DEFAULT_CANCEL_TEXT,
      saveButtonText = DEFAULT_SAVE_TEXT
    } = this.config

    const preferences = this.config.sdk.consentManager.preferences

    if (!isObjectEmpty(customConsents)) {
      this.config.sdk.addConsents(customConsents)
    }

    this.consentForm = document.createElement('td-consent-form')
    this.consentForm.setAttribute('id', 'td-consent-form')
    this.consentForm.dialogTitle = dialogTitle
    this.consentForm.dialogDescription = dialogDescription
    this.consentForm.cancelButtonText = cancelButtonText
    this.consentForm.saveButtonText = saveButtonText
    this.consentForm.preferences = preferences
    this.consentForm.consentStates = this.config.sdk.consentManager.states || {}

    this.consentForm.addEventListener('saveForm', this)
    this.consentForm.addEventListener('cancelForm', this)
    this.consentForm.addEventListener('selectionChange', this)

    container.appendChild(this.consentForm)
  },

  _selectionChange (event) {
    const selection = event.detail || {}
    const {
      contextId,
      purpose,
      value
    } = selection

    if (!this._consentStates[contextId]) {
      this._consentStates[contextId] = {
        [purpose]: {
          status: value
        }
      }
    } else {
      const context = this._consentStates[contextId]
      if (!context[purpose]) {
        context[purpose] = {
          status: value
        }
      } else {
        context[purpose]['status'] = value
      }
    }
  },

  _saveForm () {
    if (!isObjectEmpty(this._consentStates)) {
      for (const contextId in this._consentStates) {
        for (const purpose in this._consentStates[contextId]) {
          this.config.sdk.updateConsent(contextId, {
            [purpose]: this._consentStates[contextId][purpose]
          })
        }
      }

      this._consentStates = {}
    }

    this._saveConsents()
    this.consentForm.dispose()
    this._savedByForm = true
  },

  _cancelForm () {
    this._consentStates = {}

    this._savedByForm = false
    this.consentForm.dispose()
  },

  _click () {
    this.openConsentManager()
  },

  _cancelBanner () {
    if (!this._savedByForm) {
      this._saveConsents()
    }
  },

  handleEvent (event) {
    const handler = ['_', event.type].join('')
    this[handler](event)
  }
}
