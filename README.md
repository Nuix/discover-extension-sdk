# Ringtail UI Extension SDK
This SDK provides a nice API to communicate with Ringtail's UI, implemented around [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) for secure cross-origin communications. It manages serializing context and change events through JSON messages and coordinating message responses so that User Interface Extensions (UIX) don't have to worry about the details.

## [API Documentation](API.md)

## Installation
`npm install ringtail-extension-sdk`

If you want to run your extension in IE11, you'll also need polyfills for Promise and fetch:

`npm install promise-polyfill whatwg-fetch`

> NOTE This library only works in web browsers!

## Ringtail <-> App Communication
![Ringtail App Communication](https://docs.google.com/drawings/d/e/2PACX-1vQaelod9Flf14CCSyP4MhR4Qznl6n_0EllVzdNiB5gnvsdsYqO5bcwMbTphlMZUbr7tgKqqniZ0HuOx/pub?w=541&h=275)

## Getting Started
To communicate with Ringtail, initialize the SDK then hook up listeners for events you're interested in. Here's an example that listens for and displays active document changes:

#### index.html
```html
<!DOCTYPE html>
<html>
<head>
    <title>Ringtail UI Extension Test App</title>
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
        RingtailSDK.initialize().then(function () {
            // Listen for ActiveDocument changes
            RingtailSDK.on('ActiveDocument', handleActiveDocumentChanged);
        });
    </script>
</body>
</html>
```
