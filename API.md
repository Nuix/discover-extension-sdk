# RingtailSDK
The Ringtail UI Extension SDK is scoped under the `RingtailSDK` namespace.

**Conventions:** Nested namespaces are PascalCase and API methods are camelCase.

- [RingtailSDK](#RingtailSDK)
  - [Context](#Context)
  - [ActiveDocument](#activedocument)
    - [.get()](#activeaocument+get)
- [Events](#events)
  - [ExtensionReady](#extensionready)
  - [UserContext](#usercontext)

### Context
This user context is sent from Ringtail once the SDK is initialized.
- `portalUserId` <[Number]> ID of the current user in this Ringtail portal.
- `userName` <[String]> Current user's username.
- `caseId` <[Number]> ID of the user's current case, or 0 if in the portal.
- `caseName` <[String]> Display name of the current case or null if in the portal.
- `apiUrl` <[String]> URL to use to make API server calls, such as `http://ringtail.com/Ringtail-Svc-Portal/api/query`.
- `apiKey` <[String]> GUID identifying the current user to the API, such as `12345678-90ab-cdef-1234-567890abcdef`.
- `authToken` <[String]> Authentication token to make API calls on behalf of the current user. Looks like `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik...`.
- `hostLocation` <[String]> Name of the location this extension is running from. Will be one of:
  - `Workspace` - Workspace pane
  - `Case` - Case landing page
  - `Portal` - Portal landing page

### ActiveDocument

#### get() ⇒ <[ActiveDocument](#activedocument)>


# Events
Events sent from Ringtail's UI have this structure:
```json
{
    "name": "EventName",
    "data": {
        "name": "John Smith",
        "age": 34
    }
}
```

#### ActiveDocument
This event is sent from Ringtail whenever the [active document](Glossary.md#active-document) changes. If there is no active document, these fields will not be populated.
- mainId <[Main ID]> Internal ID of the active document.
- documentId <[Document ID]> Displayed ID of the document that is unique in the case.
- documentTitle <[String]> Title of the document.
- documentTypeName <[String]> Display name of the document's type.
- resultSetId <[Number]> ID of the active result set.
- entityTypeId <[Number]> ID of the active document's entity type.



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
[Serializable]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#Description "Serializable"
[Document ID]: Glossary.md#document-id "Document ID"
[Main ID]: Glossary.md#main-id "Main ID"