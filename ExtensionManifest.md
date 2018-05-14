# Extension Manifests
Extension manifests are files that specify all the settings needed to setup and configure UI extensions. They are intended to be versioned assets that are updated in Ringtail with each new UI extension release.

## Structure
Extension manifests are authored in JSON format. Here's an example:
```json
{
    "name": "Calculator",
    "description": "A nifty 4-function calculator widget",
    "type": "Workspace",
    "url": "https://calculator.example.com",
    "namePrefix": "CALC",
    "fields": [{
        "id": 1,
        "name": "Sum",
        "type": "Number",
        "isOneToOne": true,
        "codingSettings": "Write",
        "excludeFromImport": true,
    }],
    "statistics": [{
        "id": 1,
        "name": "calculations performed"
    }]
}
```

## Top-Level Settings
These settings define basic features required for every UIX.

- `name` <[String]> Name of the UIX displayed in the case home tab list or documents workspace.
- `type` <[String]> Location where the UIX will appear in Ringtail. Possible values are:
  - `Workspace` - Documents area workspace pane
  - `Case` - Case home page
  - `Portal` - Portal home page
- `url` <[String]> URL of the web app to load.
- `configuration` <[String]> (Optional) Payload stored by Ringtail and delivered to UIX upon initialization.
- `description` <[String]> (Optional) Description to differentiate similar UIX displayed in the UIX admin area.
- `privateKey` <[String]> (Optional) Key used to sign a JWT for authenticating Ringtail with backend UIX systems. See [security considerations](README.md#security-considerations) for more information.
- `namePrefix` <[String]> (Optional) Prefix used to group and differentiate UIX fields and statistics from others in Ringtail. This value is required only if fields or statistics are specified. **NOTE: This value cannot be changed after installation.**
- `fields` <[Array]<[Field](#fields)>> (Optional) Fields to create for the UIX.
- `statistics` <[Array]<[Statistic](#statistics)>> (Optional) Statistics to create for this UIX.

## Fields
Providing field settings in an extension manifest allows Ringtail to automatically create fields in cases where it is installed. This is a great way to expose UIX states to Ringtail, allowing users to search, list, and view these fields.

- `id` <[Number]> Identifier for this field in the manifest, used to lookup its concrete identifier for coding.
- `name` <[String]> Name of the field. This will be prefixed with the `namePrefix` value in Ringtail.
- `type` <[String]> Type of data the field will store. Must be one of:
  - `YesNo` - Simple boolean value
  - `Number` - Numeric value in the range [-99999999999.9999, 99999999999.9999] with at most four decimal digits
  - `Date` - Date value in ISO 8601 UTC format
  - `Text` - Simple string values with at most 255 characters
  - `Memo` - Larger string values supporting simple HTML markup with at most 4095 characters
  - `PickList` - Value picked from a provided list of choices
- `isOneToOne` <[Boolean]> (Default `true`) True to only allow a single value per document, otherwise multiple, unique values may be coded.
- `excludeFromSearch` <[Boolean]> (Default `false`) True to suppress this field from Ringtail's advanced search builder.
- `excludeFromListColumns` <[Boolean]> (Default `false`) True to suppress this field from documents list columns.
- `excludeFromImport` <[Boolean]> (Default `false`) True to prevent this field from receiving imported data.
- `excludeFromSecurity` <[Boolean]> (Default `false`) True to suppress this field from the field security UI.
- `codingSettings` <[String]> (Default `MassCode`) Maximum-allowed functionality the field may be granted for the coding UI. Must be one of:
  - `Hidden` - Does not appear
  - `Read` - Appears but is read-only
  - `Write` - Available for single coding
  - `MassCode` - Available for bulk coding
- `items` <[Array]<[FieldItem](#field-items)>> Choices avaiable for `PickList` fields.

## Field Items
Field items are pre-defined choices for `PickList` fields.

- `id` <[Number]> Identifier for this item in the manifest, used to lookup its concrete identifier for coding.
- `name` <[String]> Name of the pick list choice.

## Statistics
Statistics are counters that Ringtail will automatically aggregate across cases and roll up into queryable summaries at the portal. These are great for tracking things like feature usage and billing metrics, such as "count of docs processed" and "characters translated".

- `id` <[Number]> Identifier for this statistic in the manifest, used to lookup its concrete identifier for coding.
- `name` <[String]> Name of the statistic.





[null]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null "null"
[Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array "Array"
[boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type "Boolean"
[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type "Number"
[Object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object "Object"
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type "String"