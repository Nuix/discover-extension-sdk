# Authentication with JWTs

During initialization, Discover provides each UI extension with authentication credentials, allowing the UI extension to make Discover Connect API calls on behalf of the current user. This provides secure access to Discover&mdash;but, it does not prove the legitimacy of either the user or the Discover instance that hosts the UI extension. Therefore, if your UI extension maintains its own data outside Discover, you must take further steps to establish trust with Discover.

## Establishing Trust with Discover
Follow these steps to securely authenticate Discover and create user sessions in an external system.

1. __Provide a `privateKey` value when installing your UI extension.__ This provides Discover with a secret known only to your UI extension and Discover. Discover will then use this to sign a [JSON Web Token (JWT)](https://jwt.io/) provided to your UI extension during initialization. See the [extension manifest documentation](ExtensionManifest.md#top-level-settings) for details on this setting.

1. __Send `Ringtail.Context.externalAuthToken` to your web server during initialization.__ Once initialized, the UI extension SDK provides the signed JWT to your UI extension through its global context. Send it to your web server to validate the JWT signature against the `privateKey` provided in step 1.

1. __Create a user session from claims in the JWT.__ The JWT provided by Discover includes the following claims. Use them to construct a user session in your external system.

## JWT Claims
These are the same values available in the client SDK via  `Ringtail.Context`, though they are structured slightly differently. All claims in the provided JWT will present as strings for compatibility with .NET [ClaimsIdentity](https://msdn.microsoft.com/en-us/library/system.security.claims.claimsidentity(v=vs.110).aspx), but their source types are documented below for reference.

- `uixId` <[Number]> ID of this UIX in Discover.
- `portalUserId` <[Number]> ID of the current user in this Discover portal.
- `portalUrl` <[String]> Public URL of this Discover instance.
- `userName` <[String]> Current user's user name.
- `caseId` <[Number]> ID of the user's current case, or `0` if in the portal.
- `caseName` <[String]> Display name of the current case or `null` if in the portal.
- `caseUuid` <[String]> **9.7.003** Globally unique identifier for this case, such as `B5805A45-8537-47E2-A9EE-A946B70D5EE9`. Use this to associate data in external systems with a Discover case.
- `orgId` <[Number]> ID of the user's current organization, or `` if in the portal.
- `orgName` <[String]> Display name of the current organizaton or `` if in the portal.
- `apiUrl` <[String]> URL to use to make API server calls, such as `http://discover.example.com/Ringtail-Svc-Portal/api/query`.
- `downloadUrl` <[String]> **9.7.003** URL to use to download document files and images, such as `http://discover.example.com/Ringtail-Svc-Portal/api/download`.
- `apiAuthToken` <[String]> Authentication token to make API calls on behalf of the current user to the Discover Connect API. Looks like `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik...`.
- `hostLocation` <[String]> Name of the location in Discover where this extension is hosted, allowing UIX web apps to alter their behavior when run from different locations. Will be one of:
  - `Workspace` - Workspace pane on the Documents page
  - `Case` - Case Home page
- `ringtailVersion` <[String]> Version of Discover that the UIX is running in, such as `9.5.000.fe6290c`.
- `context` <[String]> Additional structured data as a JSON-encoded string. Parse this with a JSON decoder to extract these properties.
    - `configuration` <[Array]<[Configuration](API.md#configuration)>> An array of optional configuration strings provided by the administrator when adding UIXs. The array is empty if no configs are provided. See [Configuration](API.md#configuration) for more information.
    - `annotationSource` <[Number]> ID to use when annotating documents to indicate they should be printed by the extension for production. See [External File Printing](ExternalFilePrinting.md) for more information.
    - `namePrefix` <[String]> (Optional) Statistic and field name prefix configured for this UIX during installation.
    - `fields` <[Array]<[Object]>> (Optional) Array of field ID mappings for the active case.
        - `id` <[Number]> ID provided for this field by the [UIX manifest](ExtensionManifest.md) during installation.
        - `name` <[String]> Name provided for this field by the [UIX manifest](ExtensionManifest.md) during installation.
        - `fieldId` <[String]> ID for this field in the active case. Use this identifier when coding this field.
        - `items` <[Array]<[Object]>> Array of field value mappings for `PickList` fields. For other field types, `null`.
            - `id` <[Number]> ID provided for this value by the [UIX manifest](ExtensionManifest.md) during installation.
            - `name` <[String]> Name provided for this value by the [UIX manifest](ExtensionManifest.md) during installation.
            - `codingValue` <[Number]> Coding value for this item. Use this value when coding this field.
    - `statistics` <[Array]<[Object]>> (Optional) Array of statistics ID mappings for the active case.
        - `id` <[Number]> ID provided for this statistic by the [UIX manifest](ExtensionManifest.md) during installation.
        - `name` <[String]> Name provided for this statistic by the [UIX manifest](ExtensionManifest.md) during installation.
        - `statisticId` <[Number]> ID for this statistic in the active case. Use this identifier to write this statistic.
    - `annotations` <[Array]<[Object]>> (Optional) Array of annotation ID mappings for the active case.
      - `id` <[Number]> ID provided for this annotation by the [UIX manifest](ExtensionManifest.md) during installation.
      - `name` <[String]> Name provided for this annotation by the [UIX manifest](ExtensionManifest.md) during installation.
      - `annotationTypeId` <[String]> ID for this annotation in the active case. Use this identifier to add annotations of this type to documents via the Connect API.


[Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array "Array"
[boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type "Boolean"
[function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function "Function"
[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type "Number"
[Object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object "Object"
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type "String"
