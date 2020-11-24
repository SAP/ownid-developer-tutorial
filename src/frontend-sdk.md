## API Reference


### init

Initializes the widget and set general configurations. 
These settings will be used by all widgets on a page.

Config Properties

| Name | Required | Default Value | Description | 
|---|---|---|---|
| `URLPrefix: string` | false | `/ownid/` | Url prefix for OwnID backend sdk. E.q. `https://example.com/api/ownid/` |
| `language: string` | false | `'en'` | Language for the widget localisation |
| `statusInterval: number` | false | 2000 | Interval in ms between status calls |

### render

Renders widget. Returns [OwnID widget object](#ownid-widget-object). 

Config Properties

| Name | Required | Default Value | Description | 
|---|---|---|---|
| `element: DOMElement` | true | - | Wrapper for OwnID widget  |
| `type: string` | true | - | Type of the widget. `login` , `register`, `recover` or `link` |
| `language: string` | false | `'en'` | Language for the widget localisation. Overrides general configuration for this widget |
| `URLPrefix: string` | false | `/ownid/` | Url prefix for OwnID backend sdk. E.q. `https://example.com/api/ownid/`. Overrides general configuration for this widget |
| `desktopTitle: string` | false | default string | Title of the widget for desktop |
| `desktopSubtitle: string` | false | default string | Subtitle of the widget for desktop |
| `statusInterval: number` | false | 2000 | Interval in ms between status calls. Overrides general configuration for this widget |
| `inline`: [Inline widget config](#inline-widget) | false | - | Configuration for for inline widget |
| `note:` `boolean/null/string/` [OwnID Note](#ownid-note) | false | default string | Describes next steps after OwnID flow succeed |
| `userHandler:` [IUserHandler](#IUserHandler) | false | - | Handler for special actions required by selected flow. [Read more](#IUserHandler) |
| `data`: `{ pwrt: string }`| false | - | Used to pass additional data to OwnID widget. E.q. `pwrt` token for recover password page. | 
| `onLogin: function` | false | - | Callback for widget with type `login`. It will be called after user is logged in into the system. |
| `onRegister: function` | false | - | Callback for widget with type `register`. It will be called after user is registered into the system. |
| `onRecover: function` | false | - | Callback for widget with type `recover`. It will be called in the device recovery flow. |
| `onLink: function` | false | - | Callback for widget with type `link`. It will be called in an account linking scenario. |
| `onError: function` | false | - | Callback for when an error occurs. |

#### Inline widget

Defines a configuration for Inline widget

| Name | Required | Description | 
|---|---|---|
| `targetElement: HTMLInputElement` | true | Input Element where inline widget will be shown. E.q. password field |
| `userIdElement: HTMLInputElement` | false | Used for login functionality to verify if user exists. E.q. email or username field |
| `additionalElements: HTMLElement[]` | false | Array of elements which will be hidden after one of success callbacks will be called. E.q. confirm password field |
| `offset: [number, number]` | false | - | Moves Inline widget by `[x, y]` px. E.q. [-10, 15] will move Inline widget for 10px left and 15px down |
| `credentialsAutoFillButtonOffset:` `number` | false | Moves Safari's key icon. This param will be used as 'margin-right' for `-webkit-credentials-auto-fill-button` |

#### OwnID Note

Sets custom text to the note. You can hide it by setting `false` or `null` to this param. 

| Name | Required | Description | 
|---|---|---|
| `text: string` | true | Defines text to show when OwnID completes its flow |
| `wrapperElement: HTMLElement` | false | Wrapper for note |

You can just set your custom text to `note` param instead of providing an object. E.q. `note: '<your custom text for note>'`.

#### IUserHandler

User handler used by OwnID in different flows. 
E.q. `Login` flow uses `isUserExists` method to verify user by provided id to be able to link account with OwnID profile.

User handler should be implemented by web master.
It should provide set of functions from list below.

Not required if you are using Gigya.

| Name | Required | Description | 
|---|---|---|
| `isUserExists: function` | true | Function that checks user existence by user id (email, username, etc.). Returns `Promise<boolean>` |


### getOwnIDPayload

Returns `Promise` with OwnID response from `onLogin` or other callback, depends on widget type.
Expects [OwnID widget object](#ownid-widget-object) as incoming parameter.  

### reRenderWidget

Recreates OwnID widget.

Returns new [OwnID widget object](#ownid-widget-object).

Expects [OwnID widget object](#ownid-widget-object).  

## OwnID widget object

### destroy

Destroys the current OwnID widget.

### update

Updates OwnID widget with the new configurations.

Config Properties

| Name | Required | Default Value | Description | 
|---|---|---|---|
| `language: string` | false | `'en'` | Language for the widget localisation. Overrides general configuration for this widget |
| `desktopTitle: string` | false | default string | Title of the widget for desktop |
| `desktopSubtitle: string` | false | default string | Subtitle of the widget for desktop |
| `statusInterval: number` | false | 2000 | Interval in ms between status calls. Overrides general configuration for this widget |
| `data`: `{ pwrt: string }`| false | - | Used to pass additional data to OwnID widget. E.q. `pwrt` token for recover password page. | 
| `onLogin: function` | false | - | Callback for widget with type `login`. It will be called after user is logged in into the system. |
| `onRegister: function` | false | - | Callback for widget with type `register`. It will be called after user is registered into the system. |
| `onRecover: function` | false | - | Callback for widget with type `recover`. It will be called in the device recovery flow. |
| `onLink: function` | false | - | Callback for widget with type `link`. It will be called in an account linking scenario. |
| `onError: function` | false | - | Callback for when an error occurs. |
