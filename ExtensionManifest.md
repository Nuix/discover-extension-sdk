# Extension Manifests
Extension manifests are JSON files that specify all the settings needed to setup and configure UI extensions. They are intended to be versioned assets that are updated in Ringtail with each new UI extension release.

## Structure
Extension manifests have this general structure:
```js
{
    "name": <UIX name>,
    "description": <UIX description>,
    "configuration": <UIX global configuration>,
    "location": <Workspace|Case>,
    "url": <UIX public URL>,
    "authSecret": <secret key used to sign JWTs to authenticate Ringtail>,
    "namePrefix": <string to prefix field names with to prevent name collisions>,
    "fields": [{
        "id": <Number unique>,
        "name": <String - field name>,
        "type": <String enum - YesNo|Date|Text|Memo|PickList|Number>,
        "items": [{ id: <Number>, name: <String> }, ...],
        "isOneToOne": <true|false>,
        "isSearchable": <true|false>,
        "codingSettings": <String enum - Hidden|Read|Write|MassCode>,
        "excludeFromSecurity": <true|false>,
        "excludeFromListColumns": <true|false>,
        "excludeFromImport": <true|false>,
    }],
    "stats": [{
        "id": <Number>,
        "name": <String - stat name>,
        "description": <String>,
    }]
}
```
## Settings
