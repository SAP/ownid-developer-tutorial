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

Renders widget. Returns [Ownid widget object](#ownid-widget-object). 

Config Properties

| Name | Required | Default Value | Description | 
|---|---|---|---|
| `element: DOMElement` | true | - | Wrapper for Ownid widget  |
| `type: string` | true | - | Type of the widget. `login` , `register`, `recover` or `link` |
| `language: string` | false | `'en'` | Language for the widget localisation. Overrides general configuration for this widget |
| `URLPrefix: string` | false | `/ownid/` | Url prefix for OwnID backend sdk. E.q. `https://example.com/api/ownid/`. Overrides general configuration for this widget |
| `desktopTitle: string` | false | default string | Title of the widget for desktop |
| `desktopSubtitle: string` | false | default string | Subtitle of the widget for desktop |
| `statusInterval: number` | false | 2000 | Interval in ms between status calls. Overrides general configuration for this widget |
| `inline`: [Inline widget config](#inline-widget) | false | - | Configuration for for inline widget |
| `note:` `boolean/null/string/` [Ownid Note](#ownid-note) | false | default string | Describes next steps after Ownid flow succeed |
| `userHandler:` [IUserHandler](#IUserHandler) | false | - | Handler for special actions required by selected flow. [Read more](#IUserHandler) |
| `data`: `{ pwrt: string }`| false | - | Used to pass additional data to OwnID widget. E.q. `pwrt` token for recover password page. | 
| `onLogin: function` | false | - | Callback for widget with type `login`. It will be called after user is logged in into the system. |
| `onRegister: function` | false | - | Callback for widget with type `register`. It will be called after user is registered into the system. |
| `onRecover: function` | false | - | Callback for widget with type `recover`. It will be called in the device recovery flow. |
| `onLink: function` | false | - | Callback for widget with type `link`. It will be called in an account linking scenario. |
| `onError: function` | false | - | Callback for when an error occurs. |

### getOwnIDPayload

Returns `Promise` with Ownid response from `onLogin` or other callback, depends on widget type.
Expects [Ownid widget object](#ownid-widget-object) as incoming parameter.  

### reRenderWidget

Recreates Ownid widget.

Returns new [Ownid widget object](#ownid-widget-object).

Expects [Ownid widget object](#ownid-widget-object).  

### generateOwnIDPassword

Generates a password with provided length.
Returns string.  

## Ownid widget object

### destroy

Destroys the current Ownid widget.

### update

Updates Ownid widget with the new configurations.

## Ownid Configurations

### Inline widget

Defines a configuration for Inline widget

| Name | Required | Description | 
|---|---|---|
| `targetElement: HTMLInputElement` | true | Input Element where inline widget will be shown. E.q. password field |
| `userIdElement: HTMLInputElement` | false | Used for login functionality to verify if user exists. E.q. email or username field |
| `additionalElements: HTMLElement[]` | false | Array of elements which will be hidden after one of success callbacks will be called. E.q. confirm password field |
| `offset: [number, number]` | false | - | Moves Inline widget by `[x, y]` px. E.q. [-10, 15] will move Inline widget for 10px left and 15px down |
| `credentialsAutoFillButtonOffset:` `number` | false | Moves Safari's key icon. This param will be used as 'margin-right' for `-webkit-credentials-auto-fill-button` |

### Ownid Note

Sets custom text to the note. You can hide it by setting `false` or `null` to this param. 

| Name | Required | Description | 
|---|---|---|
| `text: string` | true | Defines text to show when Ownid completes its flow |
| `wrapperElement: HTMLElement` | false | Wrapper for note |

You can just set your custom text to `note` param instead of providing an object. E.q. `note: '<your custom text for note>'`.

### IUserHandler

User handler used by Ownid in different flows. 
E.q. `Login` flow uses `isUserExists` method to verify user by provided id to be able to link account with Ownid profile.

User handler should be implemented by web master.
It should provide set of functions from list below.

Not required if you are using Gigya.

| Name | Required | Description | 
|---|---|---|
| `isUserExists: function` | true | Function that checks user existence by user id (email, username, etc.). Returns `Promise<boolean>` |

## Quick start to using the SDK
### 1. Add a DOM container to the HTML

Open HTML page you want to edit. Add an empty `<div>` tag to mark the spot where you want to display OwnID widget.

```html
<!-- ... existing HTML ... -->
<div id="ownid"></div>
<!-- ... existing HTML ... -->
```
Where `id="ownid"` allows to find OwnID container from the JavaScript code later and display OwnID widget inside of it.

### 2. Add the Script Tag

Add `<script>` tag to the HTML page right before the closing `</body>` tag

```html
  <!-- ... other HTML ... -->

  <script async defer src="https://cdn.ownid.com/js/sdk.es5.js"></script>
</body>
```

Or if you use Gigya, add `<script>` tag to the HTML page right before the closing `</body>` tag

```html
  <!-- ... other HTML ... -->

  <script async defer src="https://cdn.ownid.com/js/gigya-sdk.es5.js"></script>
</body>
```

### 3. Create OwnID widget

Run `ownid.init` to init the widget and `ownid.render` to add OwnID widget to the page when the SDK is loaded, example:
```html
  <!-- ... HTML ... -->
  <input type="email">
  <input type="password" id="password">
  <!-- ... -->
  <div id="ownid"></div>
  <!-- ... other HTML ... -->
  <script>
    window.ownidAsyncInit = () => {
      ownid.init(); 

      ownid.render({
        type: 'register',
        element: document.querySelector('#ownid'),
        inline: {
          targetElement: document.querySelector('#password')
        }
      }); 
    }
  </script>

  <script async defer src="https://cdn.ownid.com/sdk.es5.js"></script>
  <!-- ... OR  if you are using Gigya ... -->
  <script async defer src="https://cdn.ownid.com/js/gigya-sdk.es5.js"></script>
</body>
```
This code will add OwnID widget to the `#ownid` container

## Configuring and Examples

### Registration

```html
  <!-- ... HTML ... -->
  <input type="email">
  <input type="password" id="password" placeholder="Password" name="password">
  <input type="password" id="confirm-password" placeholder="Confirm password" name="confirm-password">
  <button type="button" onclick="onSubmit()">Submit</button>
  <!-- ... -->
  <div id="ownid"></div>
  <!-- ... other HTML ... -->
  <script>
    window.ownidAsyncInit = () => {
      ownid.init({
        URLPrefix: '<your url to OwnID backend sdk>'
      }); 

      window.ownidWidget = ownid.render({
        type: 'register',
        element: document.querySelector('#ownid'),
        inline: {
          targetElement: document.querySelector('#password'),
          additionalElements: [document.querySelector('#confirm-password')],
          offset: [-10, 0]
        }
      }); 
    }

    function onSubmit() {
      ownid.getOwnIDPayload(window.ownidWidget).then(function (data) {
          // Registration call to backend with OwnID data
      });
    }

  </script>

  <script async defer src="https://cdn.ownid.com/sdk.es5.js"></script>
</body>
```

## Configuring and Examples for Gigya users

You must create in Gigya console schema next fields:

| Name | Type | Write Access | 
|---|---|---|
| `data.ownIdConnections.fido2CredentialId` | string | `clientModify` |
| `data.ownIdConnections.fido2SignatureCounter` | string | `clientModify` |
| `data.ownIdConnections.pubKey` | string | `clientCreate` |
| `data.ownIdConnections.keyHsh` | string | `clientModify` |
| `data.ownIdConnections.recoveryEncData` | string | `clientModify` |
| `data.ownIdConnections.recoveryId` | string | `clientModify` |

### Registration

Next code will show how integrate OwnID registration widget into your site.

```html
  <!-- ... HTML ... -->
  <input type="email" id="email" >
  <input type="password" id="password" placeholder="Password" name="password">
  <input type="password" id="confirm-password" placeholder="Confirm password" name="confirm-password">
  <button type="button" onclick="onSubmit()">Submit</button>
  <!-- ... -->
  <div id="ownid"></div>
  <!-- ... other HTML ... -->
  <script>
    window.ownidAsyncInit = () => {
      ownid.init({
        URLPrefix: '<your url to OwnID backend sdk>'
      }); 

      window.ownidWidget = ownid.render({
        type: 'register',
        element: document.querySelector('#ownid'),
        inline: {
          targetElement: document.querySelector('#password'),
          additionalElements: [document.querySelector('#confirm-password')],
          offset: [-10, 0]
        }
      }); 
    }

    function onSubmit() {
      var data;
      var email = document.querySelector('#email').value;
      var password = document.querySelector('#password').value;

      ownid.getOwnIDPayload(window.ownidWidget).then(function (ownidPayload) {
        if (ownidPayload.error) {
          // show error (you can use data.message)
          return;
        }
        
        if (ownidPayload.data) {
          password = window.ownid.generateOwnIDPassword(12); // or your strong password generator
          data = {
            ownIdConnections: [
              ownidResponse.data,
            ],
          };
        }

        window.gigya.accounts.initRegistration({
          callback: function (response) {
            window.gigya.accounts.register({
              regToken: response.regToken,
              email: email,
              password: password,
              data: data,
              finalizeRegistration: true,
            });
          },
        });
      });
    }
  </script>

  <script async defer src="https://cdn.ownid.com/js/gigya-sdk.es5.js"></script>
</body>
```

Structure of `ownidPayload` for Registration

- if your devise supports biometric protection
```
{
    error: null,
    data: {
      pubKey: string,
      fido2SignatureCounter: string,
      fido2CredentialId: string
    }
}
```

- if your devise doesn't support biometric protection, or it turned off
```
{
    error: null,
    data: {
      pubKey: string,
      keyHsh: string,
      recoveryId: string
    }
}
```

- on error
```
{
    error: true,
    message: string,
    data: null
}
```
- if widget wasn't touched 
```
{
    error: null,
    data: null
}
```

### Login

Next code will show how integrate OwnID login widget into your site.

After user finish OwnID flow, login will proceed on backend side.
Backend will return login cookies, and you will need to set them and navigate to the next page.

In case if user already has an account, but he wants to use OwnID. He can use skip the password on the login form. 
Widget will ask for login and password.
Web master needs update login function to use OwnID data and update Gigya data from Front-end side.
 
```html
  <!-- ... HTML ... -->
  <input type="email">
  <input type="password" id="password">
  <button type="button" onclick="onSubmit()">Login</button>
<!-- ... -->
  <div id="ownid"></div>
  <!-- ... other HTML ... -->
  <script>
    window.ownidAsyncInit = () => {
      ownid.init({
        URLPrefix: '<your url to OwnID backend sdk>'
      }); 

      window.ownidWidget = ownid.render({
        type: 'login',
        element: document.querySelector('#ownid'),
        inline: {
          userIdElement: document.querySelector('#email'),
          targetElement: document.querySelector('#password')
        },
        onLogin: function (data) {
          if (data.sessionInfo) {
            document.cookie = `${statusRS.sessionInfo.cookieName}=${statusRS.sessionInfo.cookieValue}; path=/`;
            // navigate to the home page or you next page
          }
        }
      }); 
    }

    function onSubmit() {
      var email = document.querySelector('#email').value;
      var password = document.querySelector('#password').value;

      window.gigya.accounts.login({
        loginID: email,
        password: password,
        callback: function (data) {
          if (data.status !== 'FAIL') {                                                                          
            window.ownid.getOwnIDPayload(window.ownidWidget).then(function(statusRS) {
              if (statusRS.data) {
                window.gigya.accounts.getAccountInfo({
                  include: 'data',
                  callback: (userData) => {
                    var ownIdConnections = userData.data.ownIdConnections || [];
                    
                    ownIdConnections.push(statusRS.data);

                    window.gigya.accounts.setAccountInfo({
                      data: { 
                        ownIdConnections: ownIdConnections
                      },
                    });
                  },
                });                     
              }   
            });                                                                   
          }                                                                              
        }
      }); 
    }
  </script>

  <script async defer src="https://cdn.ownid.com/js/gigya-sdk.es5.js"></script>
</body>
```

Structure of `onLogin` callback payload:
```
{
    data: {
        sessionInfo : {
            cookieName: string,
            cookieValue: string
        },
        identities: {
            provider: string,
            providerUID: string,
            email: string,
            firstName: string, 
            lastUpdated: string, // date string                      
            allowsLogin: boolean,
            isLoginIdentity: boolean,
            isExpiredSession: boolean
        }
    }
}
```
* fields depend on your registration form
* user has enabled passwodless login. If not, registration payload will be used.

### Recover

Next code will show how integrate OwnID recover widget into your site.

Recover widget will require `pwrt` GET parameter from Gigya's recover password page.
You must pass it to data field.

```html
  <!-- ... HTML ... -->
  <input type="password" id="password" placeholder="Password" name="password">
  <input type="password" id="confirm-password" placeholder="Confirm password" name="confirm-password">
  <button type="button">Submit</button>
<!-- ... -->
  <div id="ownid"></div>
  <!-- ... other HTML ... -->
  <script>
    window.ownidAsyncInit = () => {
      ownid.init({
        URLPrefix: '<your url to OwnID backend sdk>'
      }); 

      ownid.render({
        type: 'recover',
        element: document.querySelector('#ownid'),
        data: { pwrt: getUrlparameter('pwrt') }
        inline: {
          targetElement: document.querySelector('#password'),
          additionalElements: [document.querySelector('#confirm-password')],
        },
        onRecover: function (data) {
          // navigate to login page
        }
      }); 
    }
  </script>

  <script async defer src="https://cdn.ownid.com/js/gigya-sdk.es5.js"></script>
</body>
```

### Link Account

You can link your existing account with OwnID. It will enable passwordless login for you.

Next code will show how integrate OwnID link widget into your site.

`onlink` callback will be called after accounts will be linked.

```html
  <!-- ... HTML ... -->
  <div id="ownid"></div>
  <!-- ... other HTML ... -->
  <script>
    window.ownidAsyncInit = () => {
      ownid.init({
        URLPrefix: '<your url to OwnID backend sdk>'
      }); 

      ownid.render({
        type: 'link',
        element: document.querySelector('#ownid'),
        onlink: function () {}
      }); 
    }
  </script>

  <script async defer src="https://cdn.ownid.com/js/gigya-sdk.es5.js"></script>
</body>
```

