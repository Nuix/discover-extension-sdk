# Ringtail UI Extension SDK
This SDK provides a nice API to communicate with Ringtail's UI, implemented around [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) for secure cross-origin communications. It manages serializing context and change events through JSON messages and coordinating message responses so that User Interface Extensions (UIX) don't have to worry about the details.

## Getting Started
`npm install ringtail-extension-sdk`

If you want to run your extension in IE11, you'll also need polyfills for Promise and fetch:

`npm install promise-polyfill whatwg-fetch`

> NOTE This library only works in web browsers!

## API
The Ringtail UI Extension SDK relies on a JSON-based message protocol to communicate with Ringtail's UI through postMessage.
