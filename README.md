# Treasure Data JavaScript Consent UIs

Add-on UIs for [Treasure Data JavaScript SDK](https://github.com/treasure-data/td-js-sdk)  Consent Extension

This add-on provides an example of how you can use TD JavaScript SDK Consent Extension APIs with your UI to build a fully customizable consent management. It includes a cookie banner and a web form for managing consent preferences.

### Banner

A small overlay displays on top of your website to let users know that the website is using cookies (and other similar technologies) to collect data for improving user experiences. Users can choose to adjust the preferences as they want.

![banner](https://user-images.githubusercontent.com/2680785/94783615-23f50e00-03f7-11eb-9f21-fddb963cc7dc.png)

### Form

A web form for managing consent preferences

![form](https://user-images.githubusercontent.com/2680785/94783608-20fa1d80-03f7-11eb-8ac9-919f9747c345.png)

## Installing
This add-on depends on  Treasure Data JavaScript SDK to work properly, you need to load Treasure Data JavaScript SDK into your website first, see [this](https://github.com/treasure-data/td-js-sdk#installing) for more information.

Add the following JavaScript snippet to your website, it is better to put it at the end of the body tag

```javascript
<script src="https://cdn.treasuredata.com/cm/0.1/td-cm.min.js"></script>
```

When the script finishes loading, an object TDConsentManager is available in browser’s global context. You can use that object to setup your configurations accordingly

### Polyfill

The add-on is using Web Component to build the UIs, some features might not be available in legacy browsers (IE11 for example), includes the following script snippet into your `<head>` tag

```javascript
<script src="https://unpkg.com/@webcomponents/webcomponentsjs@2.5.0/webcomponents-loader.js"></script>
```
This loader dynamically loads the minimum polyfill bundle, using feature detection.

For more Information: [Web Component loader](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs)

### NPM

Does not work with NodeJS. **Browser only**
```javascript
npm install --save td-consent-ui
```
Yarn
```javascript
yarn add td-consent-ui
```
Import
```javascript
import TDConsentManager from 'td-consent-ui'
```
```javascript
const TDConsentManager = require('td-consent-ui')
```

## Usage

When the scripts are ready, you can start configuring the UIs

```javascript
TDConsentManager.setConfig({
  sdk: td, // Treasure Data JavaScript SDK instance
  container: 'selector',
  bannerContent: 'banner content'
  bannerSubContent: 'banner sub content',
  dialogTitle: 'dialog title',
  dialogDescription: 'description',
  cancelButtonText: 'Cancel',
  saveButtonText: 'Save'
})
```

**Parameters**:

- **sdk**: Object (required) - Treasure Data JavaScript SDK instance
- **container**: String | Object (optional) - Element selector or DOM object. Default `document.body`
- **bannerContent**: String (required) - The banner's content
- **bannerSubContent**: String (required) - Text of the link to the web form
- **dialogTitle**: String (optional) - Form's title
- **dialogDescription**: String (optional) - Form's description
- **cancelButtonText**: String (optional) - Cancelling button's text. Default `Cancel`
- **saveButtonText**: String (optional) - Saving button's text. Default `Save Settings`

After finishing the setup, you can use method `showBanner` to show the banner or you can use `openConsentManager` to show the web form and let users adjust their preferences

### showBanner()

Show a small overlay on top of the website to let users know that you are collecting their data to improve performance and user experience

```javascript
TDConsentManager.showBanner()
```

### openConsentManager

Show a web form for managing consent preferences. You can show the web form with your additional consents, please see [Context and Consent](https://github.com/treasure-data/td-js-sdk/blob/master/CONSENTMANAGER.md#context-and-consent) for how a consent looks like.

```javascript
TDConsentManager.openConsentManager(options)
```

**Parameters**:

- **options**: Object (optional)
  - **customConsents**: Object (optional) - Additional consents

```javascript
TDConsentManager.opentConsentManager({
	customConsents: {
    'marketing': { // <--- purpose
      description: 'description of consent',
      datatype: 'Attibutes',
      status: 'given | refused',
      expiry_date: 'YYYY-MM-DD',
      context_id: 'context_id'
    },
    'storing': { // <--- purpose
      description: 'description',
      datatype: 'datatype',
      status: 'given | refused',
      expiry_date: 'YYYY-MM-DD',
      context_id: 'context_id'
    },
    'recommendations': { // <--- purpose
      description: 'description',
      datatype: 'datatype',
      status: 'given | refused',
      expiry_date: 'YYYY-MM-DD',
      context_id: 'context_id'
    }
  }
})
```

## Full example

```javascript
// ************
// script.js
// ************
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
    database: 'database_name',
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
    // setup the UIs
    TDConsentManager.setConfig({
      sdk: td,
      bannerContent: 'We use cookies (and other similar technologies) to collect data to improve your experience on our site.',
      bannerSubContent: 'You can change your preferences at any time'
    })

    // check if the preferences exists
  	// otherwise don't do the setup again.
    if (!td.getPreferences()) {
      var contextId = td.addContext({
        brand: 'All',
        domain_name: '',
        collection_type: 'Whole website',
        collection_point_id: 'whole_website'
      })

      td.addConsents({
        analytics: {
          description: 'Consent description',
          status: td.consentManager.states.GIVEN,
          datatype: 'Visits',
          context_id: contextId,
          expiry_date: '2050-01-01'
        }
      })

      // You might want to save contexts and consents
      // td.saveContexts()
      // td.saveConsents()

      TDConsentManager.showBanner()
    }
  })

  var editPreference = document.querySelector('.edit-preferences')
  editPreference.addEventListener('click', function (event) {
    event.preventDefault()
    TDConsentManager.openConsentManager()
  })
})()

// ************
// index.html
// ************
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Website Title</title>

  <script src="https://unpkg.com/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
  <script type="text/javascript">
    <!-- Load TD JavaScript SDK here -->
  </script>
</head>
<body>
  	...
    <footer>
      <span><a href="#" class='edit-preferences'>Website Data Collection Preferences</a></span>
    </footer>
  </div>
  <script src="https://cdn.treasuredata.com/cm/0.1/td-cm.min.js"></script>
  <script src="script.js"></script>
</body>
</html>
```

## Browsers support
| IE/Edge          | Chrome | Firefox | Safari |
| ---------------- | ------ | ------- | ------ |
| IE11, Edge >= 15 | >= 60  | >= 60   | >= 9   |

## Support

Need a hand with something? Shoot us an email at support@treasuredata.com
