# Extension Manifests - Discover 9.6.009
Extension manifests are files that specify all the settings needed to setup and configure UI extensions. They are intended to be versioned assets that are updated in Discover with each new UI extension release.

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
        "excludeFromImport": true
    }],
    "statistics": [{
        "id": 1,
        "name": "calcs",
        "description": "Number of calculations performed"
    }]
}
```

## Top-Level Settings
These settings define basic features required for every UIX.

- `name` <[String]> Name of the UIX displayed on the Case Home page or as a workspace pane on the Documents page.
- `type` <[String]> Location where the UIX will appear in Discover. Must be one of:
  - `Workspace` - Workspace pane on the Documents page
  - `Case` - Case Home page
- `url` <[String]> URL of the web app to load.
- `configuration` <[String]> (Optional) Payload stored by Discover and delivered to the UIX upon initialization.
- `description` <[String]> (Optional) Description to differentiate similar UIX displayed in the UIX admin area.
- `privateKey` <[String]> (Optional) Key used to sign a JWT for authenticating Discover with backend UIX systems. See [Authentication with JWTs](AuthWithJWTs.md) for more information.
- `retrieveProductionFileUrl` <[String]> (Optional) URL to retrieve extension-authored files during production print. See [External File Printing](ExternalFilePrinting.md) for more information.
- `linkedExtensionName` <[String]> (Optional) The name of another existing UIX (primary).  This will associate annotations created by this UIX with the primary UIX, giving the user permission to modify or delete annotations created by this ancillary UIX.
- `namePrefix` <[String]> (Optional) Prefix used to group and differentiate UIX fields and statistics from other fields and statistics in Discover. This value is required if UIX fields or statistics are specified. **NOTE: This value cannot be changed after it is set.**
- `fields` <[Array]<[Field](#fields)>> (Optional) Fields to create in each case that the UIX is assigned to.
- `statistics` <[Array]<[Statistic](#statistics)>> (Optional) Statistics counters to create in each case that the UIX is assigned to.
- `annotations` <[Array]<[Annotation](#annotations)>> (Optional) Annotation types to create in each case that the UIX is assigned to.

## Fields
When you provide field settings in an extension manifest, Discover can automatically create fields in the cases where the UIX is installed. This is a great way to expose UIX states to Discover, allowing users to search, list, and view these fields.

- `id` <[Number]> Identifier for this field in the manifest, used to look up its concrete identifier for coding.
- `name` <[String]> Name of the field. This will be prefixed with the `namePrefix` value in Discover.
- `type` <[String]> Type of data the field will store. Must be one of:
  - `YesNo` - Simple Boolean value
  - `Number` - Numeric value in the range [-99999999999.9999, 99999999999.9999] with at most four decimal digits
  - `Date` - Date value in ISO 8601 UTC format
  - `Text` - Simple string values with at most 255 characters
  - `Memo` - Larger string values supporting simple HTML markup with at most 4095 characters
  - `PickList` - Value picked from a provided list of choices
- `isOneToOne` <[Boolean]> (Default `true`) If `true`, allows only a single value to be coded per document. If `false`, multiple unique values may be coded. `YesNo` fields require `isOneToOne=true`.
- `excludeFromSearch` <[Boolean]> (Default `false`) If `true`, suppresses this field from Discover's advanced search builder.
- `excludeFromListColumns` <[Boolean]> (Default `false`) If `true`, suppresses this field from appearing as a column in the List pane.
- `excludeFromImport` <[Boolean]> (Default `false`) If `true`, prevents this field from appearing on the field mapping page in the Imports feature. This prevents users from importing data into the field from a load file.
- `excludeFromSecurity` <[Boolean]> (Default `false`) If `true`, suppresses this field from the fields security UI on the Security > Objects > Fields page.
- `codingSettings` <[String]> (Default `MassCode`) Maximum-allowed functionality that the field may be granted for the coding UI. Must be one of:
  - `Hidden` - Does not appear
  - `Read` - Appears but is read-only
  - `Write` - Available for single coding
  - `MassCode` - Available for bulk coding
- `items` <[Array]<[FieldItem](#field-items)>> Choices available for `PickList` fields.

## Field Items
Field items are pre-defined choices for `PickList` fields.

- `id` <[Number]> Identifier for this item in the manifest, used to look up its concrete identifier for coding.
- `name` <[String]> Name of the pick list choice.

## Statistics
Statistics are counters that Discover will automatically aggregate across cases and roll up into queryable summaries at the portal. These are great for tracking things like feature usage and billing metrics, such as "count of docs processed" or "number of words translated."

- `id` <[Number]> Identifier for this statistic in the manifest, used to look up its concrete identifier for coding.
- `name` <[String]> Name of the statistic.

## Annotations
Annotations allow you to define new highlight and redaction types for use in annotating documents.

- `id` <[Number]> Identifier for this annotation in the manifest, used to look up its concrete identifier for coding.
- `name` <[String]> Name of the annotation.
- `redactionLabel` <[String]> (Optional) Label to attach to redactions.
- `type` <[String]> Type of annotation to create. Must be one of:
  - `Highlight` - Annotation of a specific color. In the View pane, users can see through highlight annotations to the document image underneath the highlight
  - `Redaction` - Opaque annotation that can be drawn black or white in the View pane
- `color` <[String]> Color of the annotation, if the annotation is of `type`=`Highlight`. Must be one of:
  - `Beige`
  - `Blue`
  - `Brown`
  - `Cyan`
  - `Green`
  - `Grey`
  - `Orange`
  - `Pink`
  - `Purple`
  - `Red`
  - `Silver`
  - `Yellow`
  - `LightPink`
  - `MediumOrange`
  - `MediumYellow`
  - `LightYellow`
  - `AppleGreen`
  - `MediumAppleGreen`
  - `LightAppleGreen`
  - `MediumGreen`
  - `LightGreen`
  - `LightBlue`
  - `Azure`
  - `MediumAzure`
  - `LightAzure`
  - `MediumPurple`
  - `LightPurple`
  - `MediumBrown`
  - `LightBrown`
  - `LightGrey`




[null]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null "null"
[Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array "Array"
[boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type "Boolean"
[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type "Number"
[Object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object "Object"
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type "String"
