# Ringtail UI Extension SDK
This SDK provides an API to communicate with Ringtail's UI, implemented around [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) for secure cross-origin communications. It manages serializing context and change events through JSON messages and coordinating message responses so that User Interface Extensions (UIX) don't have to worry about the details.

## [API Documentation](API.md)

## Ringtail Apps
User Interface Extensions (UIXs) are the user-visible faces of Ringtail apps. Ringtail loads up UIX web applications inline in its interface and provides them user and workspace context and Connect API access. Given that, simple, single-page web applications can comprise complete Ringtail apps.

The below diagram shows a minimal UIX deployment (green). This SDK (yellow) registers UIXs with Ringtail and exposes access to the Ringtail client state and Connect API.

![Ringtail App Communication](https://docs.google.com/drawings/d/e/2PACX-1vQaelod9Flf14CCSyP4MhR4Qznl6n_0EllVzdNiB5gnvsdsYqO5bcwMbTphlMZUbr7tgKqqniZ0HuOx/pub?w=572&h=272)

[Edit the diagram](https://docs.google.com/drawings/d/19RsszUNRVVsDDBWSVHs8ffEncUDB66Hi78pgaAGGkhQ/edit?usp=sharing)

## Installation
`npm install ringtail-extension-sdk`

If you want to run your extension in IE11, you'll also need polyfills for Promise and fetch:

`npm install promise-polyfill whatwg-fetch`

> NOTE: This library only works in web browsers!

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
