# RingtailSDK
The Ringtail UI Extension SDK is available from the `RingtailSDK` namespace on the global `window` object.

**Conventions:** Nested namespaces are PascalCase and API methods are camelCase.

- [RingtailSDK](#ringtailsdk)
  - [.initialize()](#initialize--promise)
  - [.on(eventName, callback)](#oneventname-callback)
  - [.off(eventName, callback)](#offeventname-callback)
  - [.setLoading(loading)](#setloadingloading)
  - [.query(graphQl[, variables])](#querygraphql-variables--promise)
  - [Context](#context)
  - [ActiveDocument](#activedocument)
    - [.get()](#get--activedocument)
    - [.set(mainId)](#setmainid--promise)
  - [DocumentSelection](#documentselection)
- [Events](#events)
  - [ActiveDocument](#activedocument-1)
  - [DocumentSelection](#documentselection-1)
  - [FacetSelection](#facetselection)
  - [PaneHidden](#panehidden)
  - [PaneVisible](#panevisible)
  - [ToolAction](#toolaction)

#### .initialize() ⇒ <[Promise]>
- returns: A promise that resolves once the <[Context](#context)> is available and the SDK is ready for use.

Initializes the SDK and registers the UIX with Ringtail.

#### .on(eventName, callback)
- `eventName` <[String]> Name of the [event](#events) to listen for.
- `callback` <[Function]> Callback function to be called with these parameters:
  - `event` <[Event](#events)> Event object received from Ringtail.

Subscribes the provided `callback` to be called when the given event is received from Ringtail.

#### .off(eventName, callback)
- `eventName` <[String]> Name of the [event](#events) originally subscribed to.
- `callback` <[Function]> Callback function originally passed to [.on()](#oneventname-callback).

Removes the provided `callback` subscription to the given event.

#### .setLoading(loading)
- `loading` <[Boolean]> `true` to display the loading mask, `false` to hide it.

Displays or hides a loading mask over the UIX to block user interactions.

#### .query(graphQl[, variables]) ⇒ <[Promise]>
- `graphQl` <[String]> [GraphQL]((http://graphql.org/learn/)) query for Ringtail's Connect API.
- `variables` <[Object]> (Optional) Object providing values for variables in the query.
- returns: A promise that resolves to the results of the query.

Executes the given [GraphQL]((http://graphql.org/learn/)) query against Ringtail in the context of the current user. Use Ringtail's Connect API Explorer (available from the Portal) to build and test queries and review documentation.


### Context
Static object containing context information about the current Ringtail user. It is available once the SDK is initialized.
- `portalUserId` <[Number]> ID of the current user in this Ringtail portal.
- `userName` <[String]> Current user's username.
- `caseId` <[Number]> ID of the user's current case, or `0` if in the portal.
- `caseName` <[String]> Display name of the current case or `null` if in the portal.
- `apiUrl` <[String]> URL to use to make API server calls, such as `http://ringtail.com/Ringtail-Svc-Portal/api/query`.
- `apiKey` <[String]> GUID identifying the current user to the API, such as `12345678-90ab-cdef-1234-567890abcdef`.
- `authToken` <[String]> Authentication token to make API calls on behalf of the current user. Looks like `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik...`.
- `hostLocation` <[String]> Name of the location in Ringtail where this extension is hosted, allowing UIX web apps to alter their behavior when run from different locations. Will be one of:
  - `Workspace` - Workspace pane
  - `Case` - Case landing page
  - `Portal` - Portal landing page


### ActiveDocument

#### get() ⇒ <[ActiveDocument](#activedocument-1)>
- returns: Information about the current active document

#### set(mainId) ⇒ <[Promise]>
- `mainId` <[Main ID]> Main ID of the document to activate.
- returns: A promise that resolves upon Ringtail's acknowledgement of the request


### DocumentSelection

#### get() ⇒ <[Promise]>
- returns: A promise resolving to an object with these properties:
  - `mainIds` <[Array]<[Main ID]>> Array of numerical main IDs.

This request may take a long time to complete depending on the size of the active [result set] and the number of selected documents. It is advisable to request the full document selection only sparingly.

#### set(mainId) ⇒ <[Promise]>
- `mainId` <[Main ID]> Main ID of the document to activate.
- returns: A promise that resolves upon Ringtail's acknowledgement of the request

#### select(mainId) ⇒ <[Promise]>
- `mainId` <[Main ID]> Main ID of the document to activate.
- returns: A promise that resolves upon Ringtail's acknowledgement of the request

# Events
Events sent from Ringtail's UI have this structure:
```js
{
    "name": "ActiveDocument", // Required, always present
    "data": {                 // Optional, null if unused
        "mainId": 289346,
        "documentId": "ENRON-0029918",
        "resultSetId": 1903,
        ...
    }
}
```
Event properties are nested in a `data` object, so access them like so:

```js
var mainid = event.data.mainId;
```

#### ActiveDocument
- `mainId` <[Main ID]> Internal ID of the active document.
- `documentId` <[Document ID]> Displayed ID of the document that is unique in the case.
- `documentTitle` <[String]> Title of the document.
- `documentType` <[Number]> ID of the document's type.
- `documentTypeName` <[String]> Display name of the document's type.
- `resultSetId` <[Number]> ID of the active result set.
- `entityTypeId` <[Number]> ID of the active document's entity type.

This event is sent from Ringtail whenever the [active document](Glossary.md#active-document) changes. If there is no active document, these fields will not be populated.


[null]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null "null"
[Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array "Array"
[boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type "Boolean"
[function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function "Function"
[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type "Number"
[Object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object "Object"
[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise "Promise"
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type "String"
[Error]: https://nodejs.org/api/errors.html#errors_class_error "Error"
[Map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map "Map"

[Document ID]: Glossary.md#document-id "Document ID"
[Main ID]: Glossary.md#main-id "Main ID"
[Result set]: Glossary.md#result-set "Result set"