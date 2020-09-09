import ConsentManager from '../index'

beforeEach(() => {
  ConsentManager.setConfig({
    sdk: {
      consentManager: {
        consentTable: 'consent_table',
        contextTable: 'context_table',
        successConsentCallback: jest.fn(),
        expiredConsentsCallback: jest.fn()
      },
      updateConsent: jest.fn(),
      saveConsents: jest.fn()
    },
    bannerContent:
      'Magna laboris mollit id dolore aute ex cupidatat qui elit ex do sunt.Aute laborum do enim anim excepteur.',
    bannerSubContent: 'Mollit est enim non nulla culpa reprehenderit.',

  })
})

test('sdk instance should be set', () => {
  expect(ConsentManager.config.sdk).toBeDefined()
});

test('should open banner', () => {
  ConsentManager.showBanner()

  const banner = document.querySelector('#td-consent-banner')

  expect(banner).toBeDefined()
})

test('should call saveConsents when close the banner', () => {
  ConsentManager.showBanner()

  const banner = document.querySelector('#td-consent-banner')

  banner.dispatchEvent(new Event('cancel'))
  expect(ConsentManager.config.sdk.saveConsents).toHaveBeenCalled()
})

test('should open consent form', () => {
  const spy = jest.spyOn(ConsentManager, 'openConsentManager')
  ConsentManager.showBanner()

  const banner = document.querySelector('#td-consent-banner')

  banner.dispatchEvent(new Event('click'))
  expect(spy).toHaveBeenCalled()

  spy.mockRestore()
})

test('should open consent form', () => {
  ConsentManager.openConsentManager()

  const form = document.querySelector('#td-consent-form')

  expect(form).toBeDefined()
})

test('should call saveConsents', () => {
  ConsentManager.openConsentManager()

  const form = document.querySelector('#td-consent-form')

  var spy = jest.spyOn(ConsentManager.consentForm, 'dispose')

  form.dispatchEvent(new Event('save'))

  expect(ConsentManager.config.sdk.saveConsents).toHaveBeenCalled()
  expect(spy).toHaveBeenCalled()

  spy.mockRestore()
})

test('should call updateConsent', () => {
  ConsentManager.openConsentManager()

  const form = document.querySelector('#td-consent-form')

  form.dispatchEvent(new CustomEvent('selectionChange', { detail: { contextId: 'blah', purpose: 'blah', value: 'rejected' } }))

  expect(ConsentManager.config.sdk.updateConsent).toHaveBeenCalled()
})
