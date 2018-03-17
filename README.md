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
