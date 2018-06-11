# Authentication with JWTs

During initialization, Ringtail provides each UI extension with authentication credentials, allowing the UI extension to make Ringtail Connect API calls on behalf of the current user. This provides secure access to Ringtail&mdash;but, it does not prove the legitimacy of either the user or the Ringtail instance that hosts the UI extension. Therefore, if your UI extension maintains its own data outside Ringtail, you must take further steps to establish trust with Ringtail.

## Establishing Trust with Ringtail
Follow these steps to securely autenticate Ringtail and create user sessions in an external system.

1. __Provide a `privateKey` value when installing your UI extension.__ This provides Ringtail with a secret known only to your UI extension and Ringtail. Ringtail will then use this to sign a [JSON Web Token (JWT)](https://jwt.io/) provided to your UI extension during initialization. See the [extension manifest documentation](ExtensionManifest.md#top-level-settings) for details on this setting.

1. __Send `Ringtail.Context.externalAuthToken` to your web server during initialization.__ Once initialized, the UI extension SDK provides the signed JWT to your UI extension through its global context. Send it to your web server to validate the JWT signature against the `privateKey` provided in step 1.

1. __Create a user session from claims in the JWT.__ The JWT provided by Ringtail includes the following claims. Use them to construct a user session in your external system.

## JWT Claims
These are the same values available in the client SDK via  `Ringtail.Context`, though they are structured slighly differently. All claims in the provided JWT will present as strings for compatibility with .NET [ClaimsIdentity](https://msdn.microsoft.com/en-us/library/system.security.claims.claimsidentity(v=vs.110).aspx), but their source types are documented below for reference.

- `uixId` <[Number]> ID of this UIX in Ringtail.
- `portalUserId` <[Number]> ID of the current user in this Ringtail portal.
- `portalUrl` <[String]> Public URL of this Ringtail instance.
- `userName` <[String]> Current user's user name.
- `caseId` <[Number]> ID of the user's current case, or `0` if in the portal.
- `caseName` <[String]> Display name of the current case or `null` if in the portal.
- `caseUuid` <[String]> Globally unique identifier for this case, such as `http://ringtail.com/17` for case `17` on the `ringtail.com` portal.
- `apiUrl` <[String]> URL to use to make API server calls, such as `http://ringtail.com/Ringtail-Svc-Portal/api/query`.
- `apiAuthToken` <[String]> Authentication token to make API calls on behalf of the current user to the Ringtail Connect API. Looks like `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik...`.
- `hostLocation` <[String]> Name of the location in Ringtail where this extension is hosted, allowing UIX web apps to alter their behavior when run from different locations. Will be one of:
  - `Workspace` - Workspace pane on the Documents page
  - `Case` - Case Home page
- `ringtailVersion` <[String]> Version of Ringtail that the UIX is running in, such as `9.5.000.fe6290c`.
- `context` <[String]> Additional structured data as a JSON-encoded string. Parse this with a JSON decoder to extract these properties.
    - `configuration` <[Array]<[Configuration](API.md#configuration)>> An array of optional configuration strings provided by the administrator when adding UIXs. The array is empty if no configs are provided. See [Configuration](API.md#configuration) for more information.
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


[Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array "Array"
[boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type "Boolean"
[function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function "Function"
[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type "Number"
[Object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object "Object"
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type "String"
