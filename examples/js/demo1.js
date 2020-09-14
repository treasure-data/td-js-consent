!(function () {
  function successCallback (preferences) {
    var analytics = preferences['analytics'] || {}
    if (analytics.status === 'given') {
      td.setSignedMode()
      td.unblockEvents()
    } else if (analytics.status === 'refused') {
      td.setAnonymousMode()
      td.blockEvents()
    }

    td.trackPageview()
  }

  var td = new Treasure({
    database: 'consent_management_test',
    writeKey: '1/xxxxxxxxxx',
    host: 'in.treasuredata.com',
    consentManager: {
      successConsentCallback: successCallback,
      expiredConsentsCallback: function (consents) {
        console.log(consents)
      },
      failureConsentCallback: function (error) {
        console.log(error)
      }
    }
  })
  td.ready(function () {
    TDConsentManager.setConfig({
      sdk: td,
      bannerContent: 'We use cookies (and other similar technologies) to collect data to improve your experience on our site.',
      bannerSubContent: 'You can change your preferences at any time'
    })

    if (!td.getPreferences()) {
      var contextId = td.addContext({
        brand: 'All',
        domain_name: '',
        collection_type: 'Whole website',
        collection_point_id: 'whole_website'
      })

      td.addConsents({
        analytics: {
          description:
            'We use browser cookies that are necessary for the site to work as intended.For example, we store your website data collection preferences so we can honor them if you return to our site. You can disable these cookies in your browser settings but if you do the site may not work as intended.',
          status: td.consentManager.states.GIVEN,
          datatype: 'Visits',
          context_id: contextId,
          expiry_date: '2020-09-10'
        }
      })

      contextId = td.addContext({
        brand: 'Arm Limited',
        domain_name: 'arm.com',
        collection_type: 'Shopping Cart',
        collection_point_id: 'shopping_trnx_id'
      })

      td.addConsents({
        recommendations: {
          description:
            'Ex aliquip aliqua irure quis nisi reprehenderit pariatur occaecat excepteur consectetur amet consequat.',
          status: td.consentManager.states.GIVEN,
          datatype: 'Purchases',
          context_id: contextId
        },
        storing: {
          description:
            'Ex aliquip aliqua irure quis nisi reprehenderit pariatur occaecat excepteur consectetur amet consequat.',
          datatype: 'Purchases',
          status: td.consentManager.states.REFUSED,
          context_id: contextId
        }
      })

      contextId = td.addContext({
        brand: 'TreasureData',
        domain_name: 'treasuredata.com',
        collection_type: 'Subscription form',
        collection_point_id: 'subscription_form'
      })

      td.addConsents({
        predictions: {
          description:
            'Ex aliquip aliqua irure quis nisi reprehenderit pariatur occaecat excepteur consectetur amet consequat.',
          status: td.consentManager.states.REFUSED,
          datatype: 'Visits',
          context_id: contextId
        },
        researches: {
          description:
            'Ex aliquip aliqua irure quis nisi reprehenderit pariatur occaecat excepteur consectetur amet consequat.',
          datatype: 'Attributions',
          status: td.consentManager.states.REFUSED,
          context_id: contextId
        }
      })
      td.saveContexts()

      TDConsentManager.showBanner()
    }
  })

  var editPreference = document.querySelector('.edit-preferences')
  editPreference.addEventListener('click', function (event) {
    event.preventDefault()
    TDConsentManager.openConsentManager()
  })
})()
