## API Reference


### init

Initializes the widget and set general configurations.

Config Properties

| Name | Required | Default Value | Description | 
|---|---|---|---|
| `URLPrefix: string` | false | `/ownid/` | Url prefix for ownid backend sdk. E.q. `https://example.com/api/ownid/` |
| `language: string` | false | `'en'` | Language for the widget localisation |
| `statusInterval: number` | false | 2000 | Interval in ms between status calls |

### render

Renders widget. Returns [Ownid widget object](#widget-obj). 

Config Properties

| Name | Required | Default Value | Description | 
|---|---|---|---|
| `element: DOMElement` | true | - | Wrapper for Ownid widget  |
| `type: string` | true | - | Type of the widget. `login` , `register`, `recover` or `link` |
| `language: string` | false | `'en'` | Language for the widget localisation |
| `URLPrefix: string` | false | `/ownid/` | Url prefix for ownid backend sdk. E.q. `https://example.com/api/ownid/` |
| `partial: boolean` | false | false | enables partial flow |
| `mobileTitle: string` | false | default string | This text will be shown on mobile button |
| `desktopTitle: string` | false | default string | Title of the widget for desktop |
| `desktopSubtitle: string` | false | default string | Subtitle of the widget for desktop |
| `statusInterval: number` | false | 2000 | Interval in ms between status calls |
| `onLogin: function` | false | - | Callback for widget with type `login`. It will be called after user is logged in into the system. |
| `onRegister: function` | false | - | Callback for widget with type `register`. It will be called after user is registered into the system. |
| `onRecover: function` | false | - | Callback for widget with type `recover`. It will be called in the device recovery flow. |
| `onLink: function` | false | - | Callback for widget with type `link`. It will be called in an account linking scenario. |
| `onError: function` | false | - | Callback for when an error occurs. |

### destroy

Destroys the current Ownid widget.

### update

Updates Ownid widget with the new configurations.

