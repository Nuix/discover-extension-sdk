# Ringtail User Interface Extension SDK
This SDK provides an API to communicate with Ringtail's UI for use in UI Extensions, part of Ringtail's extensibility model.

## [API Documentation](API.md)

## User Interface Extensions
Ringtail can be extended by embedding 3rd party web applications directly into it's interface. Such external applications are called User Interface Extensions (UIX). Ringtail provides them user and workspace context and Connect API access so they can read and write data to Ringtail and respond to user actions in Ringtail's UI.

The below diagram shows how an external web application (green) can communicate with Ringtail (blue). This SDK (yellow) provides the glue for UIX clients to communicate directly with Ringtail.

![Ringtail App Communication](https://docs.google.com/drawings/d/e/2PACX-1vQaelod9Flf14CCSyP4MhR4Qznl6n_0EllVzdNiB5gnvsdsYqO5bcwMbTphlMZUbr7tgKqqniZ0HuOx/pub?w=572&h=272)

[Edit the diagram](https://docs.google.com/drawings/d/19RsszUNRVVsDDBWSVHs8ffEncUDB66Hi78pgaAGGkhQ/edit?usp=sharing)

## Installation
`npm install ringtail-extension-sdk`

To support IE11, you'll also need to provide Promise and fetch polyfills, such as:

`npm install promise-polyfill whatwg-fetch`

> NOTE: This library only works in web browsers! For compatibility, UIXs must support all browsers that Ringtail supports - as of 2018-03-16 this includes: IE11, Chrome, and Edge.

## Getting Started
To communicate with Ringtail, initialize the SDK then hook up listeners for events you're interested in. Here's an example that listens for and displays active document changes:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Ringtail UI Extension Test App</title>
    <script src="Ringtail.js" type="text/javascript"></script>
</head>
<body>
    <b>Active Document</b>
    <p>
        <table>
            <tr><td>Document ID</td><td class="active-doc-id"></td></tr>
            <tr><td>Main ID</td><td class="active-main-id"></td></tr>
            <tr><td>Entity Type ID</td><td class="active-entity-type-id"></td></tr>
            <tr><td>Result Set ID</td><td class="active-result-set-id"></td></tr>
        </table>
    </p>

    <script>
        function handleActiveDocumentChanged(message) {
            document.querySelector('.active-doc-id').innerHTML = message.data.documentId;
            document.querySelector('.active-main-id').innerHTML = message.data.mainId;
            document.querySelector('.active-entity-type-id').innerHTML = message.data.entityTypeId;
            document.querySelector('.active-result-set-id').innerHTML = message.data.resultSetId;
        }

        // Establish communication with Ringtail
        Ringtail.initialize().then(function () {
            // Listen for ActiveDocument changes
            Ringtail.on('ActiveDocument', handleActiveDocumentChanged);
        });
    </script>
</body>
</html>
```

## Security Considerations
During initialization, Ringtail provides each UIX with authentication credentials allowing it to make Connect API calls on behalf of the current user. This provides secure access to Ringtail but proves legitimacy of neither the user nor the hosting Ringtail instance to the UIX. Therefore, further steps are required establish trust with the Ringtail instance hosting your UIX.

### Security Guidelines

1. __Restrict the domains allowed to host your UIX to those you expect.__ To whitelist allowed domains, pass them in an array to `Ringtail.initialize([domain1, domain2, ...])`. This step prevents unknown sites from hosting your UIX and spoofing Ringtail.
1. __Verify Ringtail authenticity via a provided secret.__ Provide a secret via configuration to Ringtail when your UIX is installed and verify it during initialization. This step prevents unknown actors from emulating an expected, whitelisted domain.

#### Full Example
Provide a secret configuration during UIX installation:
```js
// Set this in the "Configuration" field in Ringtail
{ secret: '<some string to validate>' }
```

Provide the domain whitelist and validate the secret during UIX initialization:
```js
// Only allow communication with these domains:
var domainWhitelist = ['https://ringtail.com', 'https://portal02.ringtail.com'];

Ringtail.initialize(domainWhitelist).then(function (hostDomain) {
    // Collect data needed to authenticate Ringtail with your external UIX server
    var authData = {
        // These two together uniquely identify a Ringtail case across portals
        portal: hostDomain, // <-- Guaranteed to be one of the domains in domainWhitelist
        caseId: Ringtail.Context.caseId,

        // Info and creds to call the Ringtail Connect API
        apiUrl: Ringtail.Context.apiUrl,
        apiKey: Ringtail.Context.apiKey,
        authToken: Ringtail.Context.authToken,

        // Contains the secret provided during UIX installation above
        configuration: Ringtail.Context.configuration
    };
    
    // Now send this data to your webserver to authenticate Ringtail.
    // If the secret doesn't match, bail out!
});