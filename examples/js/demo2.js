!function() {
  var storageKey = 'custom_consent_preferences'
  function successCallback (preferences) {
    console.log(preferences)
  }
  function expiredConsentsCallback (consents) {
    console.log(consents)
  }

  var td = new Treasure({
    database: 'consent_management_test',
    writeKey: '1/xxxxxxxxxx',
    host: 'in.treasuredata.com',
    consentManager: {
      storageKey: storageKey,
      successConsentCallback: successCallback,
      expiredConsentsCallback: expiredConsentsCallback
    }
  })

  td.ready(function () {
    if (!td.getPreferences()) {
      td.addContext({
        brand: 'Sainsbury',
        domain_name: 'sainsbury.com',
        collection_type: 'Signin Form',
        collection_point_id: 'signin_form',
        other_1: 'other 1',
        other_2: 'other 2',
        other_3: 'other 3',
        other_4: 'other 4'
      })

      td.saveContexts()
    }

    TDConsentManager.setConfig({
      sdk: td,
      bannerContent: 'We use cookies (and other similar technologies) to collect data to improve your experience on our site.',
      bannerSubContent: 'You can change your preferences at any time'
    })

    updateDebugger()
  })

  function updateDebugger () {
    const contextEl = document.querySelector('.contexts')
    const consentEl = document.querySelector('.consents')
    const expiredConsentsEl = document.querySelector('.expired-consents')

    contextEl.innerHTML = ''
    contextEl.innerHTML = JSON.stringify(td.getContexts(), null, 2)

    consentEl.innerHTML = ''
    consentEl.innerHTML = JSON.stringify(td.getConsents(), null, 2)

    expiredConsentsEl.innerHTML = ''
    expiredConsentsEl.innerHTML = JSON.stringify(td.getExpiredConsents(), null, 2)
  }

  function getContextByCollectionType (type) {
    var contexts = td.getContexts()
    var index
    for (index = 0; index < contexts.length; index++) {
      if (contexts[index].collection_type === type) {
        return contexts[index]
      }
    }
  }

  function addTermsAndConditions (checked) {
    var context = getContextByCollectionType('Signin Form') || getContextByCollectionType('default')
    var status = checked ? td.consentManager.states.GIVEN : td.consentManager.states.REFUSED
    td.addConsents({
      'term and conditions': {
        description: 'Voluptate exercitation nulla qui irure do aute culpa laboris culpa exercitation commodo deserunt.',
        status: status,
        datatype: 'Attributions',
        context_id: context && context.context_id || undefined
      }
    })
  }

  function addPermissionConsent (checked) {
    var context = getContextByCollectionType('Signin Form') || getContextByCollectionType('default')
    var status = checked ? td.consentManager.states.GIVEN : td.consentManager.states.REFUSED
    td.addConsents({
      'permission': {
        description: 'Voluptate exercitation nulla qui irure do aute culpa laboris culpa exercitation commodo deserunt.',
        status: status,
        datatype: 'Attributions',
        context_id: context.context_id
      }
    })
  }

  function addSignupConsents (name, checked) {
    var context = getContextByCollectionType('Signup Form')
    var contextId
    if (!context) {
      contextId = td.addContext({
        brand: 'TreasureData',
        domain_name: 'treasuredata.com',
        collection_type: 'Signup Form',
        collection_point_id: 'signup_form',
        other_1: 'other 1',
        other_2: 'other 2',
        other_3: 'other 3',
        other_4: 'other 4'
      })
      td.saveContexts()
    } else {
      contextId = context.context_id
    }

    var status = checked ? td.consentManager.states.GIVEN : td.consentManager.states.REFUSED

    if (name === 'email') {
      td.addConsents({
        'email marketing': {
          description: 'Id deserunt minim ullamco enim incididunt non laborum labore et sunt et.',
          datatype: 'Attributions',
          context_id: contextId,
          status: status,
          expiry_date: '2020-07-30'
        }
      })
    }

    if (name === 'samples') {
      td.addConsents({
        'samples email': {
          description: 'Id deserunt minim ullamco enim incididunt non laborum labore et sunt et.',
          datatype: 'Attributions',
          context_id: contextId,
          status: status
        }
      })
    }
  }

  function addMarketingConsent(checked) {
    var status = checked ? td.consentManager.states.GIVEN : td.consentManager.states.REFUSED
    td.addConsents({
      'sms marketing': {
        description: 'Id deserunt minim ullamco enim incididunt non laborum labore et sunt et.',
        datatype: 'Attributions',
        status: status,
        expiry_date: '2020-07-30'
      }
    })
  }

  var form1 = document.querySelector('.form-wrapper')
  form1.addEventListener('click', function (event) {
    var name = event.target.name

    if (name === 'agree') {
      var checked = event.target.checked
      addTermsAndConditions(checked)
    } else if (name === 'permission') {
      var checked = event.target.value === "1" || false
      addPermissionConsent(checked)
    } else if (name === 'email' || name === 'samples') {
      addSignupConsents(name, event.target.checked)
    } else if (name === 'sms') {
      addMarketingConsent(event.target.checked)
    }

    updateDebugger()
  })
  var btn1 = document.querySelector('.save-prefs-1')
  btn1.addEventListener('click', function (event) {
    event.preventDefault()
    td.saveConsents()
    updateDebugger()
  })


  var editPreference = document.querySelector('.edit-preferences')
  editPreference.addEventListener('click', function (event) {
    event.preventDefault()
    TDConsentManager.openConsentManager()
  })

  var btn2 = document.querySelector('.save-prefs-2')
  btn2.addEventListener('click', function (event) {
    event.preventDefault()
    td.saveConsents()
    updateDebugger()
  })

  var btn3 = document.querySelector('.save-prefs-3')
  btn3.addEventListener('click', function (event) {
    event.preventDefault()
    td.saveConsents()
    updateDebugger()
  })

  var updateContextBtn = document.querySelector('.update-context')
  updateContextBtn.addEventListener('click', function (event) {
    event.preventDefault()

    var contextId = document.querySelector('input[name="contextId"]').value
    var content = document.querySelector('textarea[name="content"]').value

    if (!contextId || !content) return

    var json = JSON.parse(content)

    td.updateContext(contextId, json)

    updateDebugger()
  })

  var updateConsentBtn = document.querySelector('.update-consent')
  updateConsentBtn.addEventListener('click', function (event) {
    event.preventDefault()

    var contextId = document.querySelector('input[name="contextId"]').value
    var content = document.querySelector('textarea[name="content"]').value

    if (!contextId || !content) return

    var json = JSON.parse(content)

    td.updateConsent(contextId, json)
    td.saveConsents()
    updateDebugger()
  })

  var saveContextsBtn = document.querySelector('.save-contexts')
  saveContextsBtn.addEventListener('click', function () {
    td.saveContexts()
  })
}()
