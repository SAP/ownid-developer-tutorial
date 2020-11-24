## SAP Customer Data Cloud (Gigya)

OwnID offers a plug-and-play integration with SAP CDC. This section will guide you on to integrate OwnID when using screen-sets or Gigya APIs. The configuration part below is relevant for both integration options.

### Configuration

In order to integrate OwnID in your SAP Customer Data Cloud website, make sure you cover the following prerequisites:

#### Access to OwnID Server

If you want to know more about the OwnID Server component, please read [this](server-sdk.md) section.

When using the OwnID cloud hosted solution, you will get access to the `URLPrefix`. This URL is used by the WEB SDK to communicate with the Server component of OwnID and it will be configured when the OwnID Web SDK is initialized.\
You can check the connectivity with server following the steps described in [this](troubleshooting?id=checking-connectivity-with-the-server) section.

#### Access and Permissions

- Permissions to run the following Gigya REST API endpoints:
  - accounts.setSchema  
  - accounts.setAccountInfo
  - accounts.getAccountInfo
  - accounts.notifyLogin
  - accounts.getJWTPublicKey
  - accounts.resetPassword
  - accounts.deleteAccount

- Gigya console access (https://console.gigya.com/)

#### Generating Gigya Auth Keys

Most REST API requests to Customer Data Cloud should be made securely, using an authentication mechanism. Using an application key and a secret is one of the recommended methods by SAP Customer Data Cloud and requires creating an application on the Console, that is associated with a permission group.

To generate an application key and secret to allow OwnID to perform REST API requests to SAP Customer Data Cloud, please check the instructions [here](https://developers.gigya.com/display/GD/Signing+Requests+to+SAP+Customer+Data+Cloud#SigningRequeststoSAPCustomerDataCloud-ApplicationandUserKeys).

#### Configuring Gigya Schema

For proper OwnId functioning, the following fields should be created in the Gigya schema object, with the namespace **data.ownIdConnections**:

| Field Name | Type | Encrypted | Write Access | Required | Nullable | Field purpose |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| pubKey | basic-string | YES | clientCreate | NO | YES | User public key |
| keyHsh | basic-string | YES | clientCreate | NO | YES | Hash of pubKey for better search performance |
| fido2CredentialId | basic-string | YES | clientCreate | NO | YES | Allows Fido2 authorisation to function |
| fido2SignatureCounter | basic-string | YES | clientCreate | NO | YES | Allows Fido2 authorisation to function |
| recoveryId | basic-string | YES | clientCreate | NO | YES | Connection recovery identifier |
| recoveryEncData | basic-string | YES | clientCreate | NO | YES | Encrypted connection recovery data |

You have two options to set up the fields:

1. Directly from the Schema Editor in the Gigya Console.
2. Using the Gigya REST endpoint (accounts.setSchema). A sample collection with the necessary call can be downloaded here.

**NOTE:**
Inside the postman collection, you will find some variables you need to replace. You can find the reference in the table below:

| Variable        | Description   |
| --------------- |:-------------:|
| {{dataCenter}}  | Data Center of your apiKey. Possible values: eu1, us1 or au1 |
| {{apiKey}}      | Gigya apiKey  |
| {{userKey}}     | Gigya User or Application Key      |  
| {{secret}}      | Gigya User or Application Secret      |  

### Screen-sets Integration

#### Set Default ScreenSets

To select the default "RegistrationLogin" screen-set you wish to use in web and mobile, please follow [this](https://developers.gigya.com/display/GD/Policies#Policies-DefaultLoginandRegistrationScreen-Set) instructions.

#### Initialize OwnID SDK

Run `ownid.init` to initialize the widget in your Login, Registration, and Forget Password pages. example:

```html
  <!-- ... other HTML ... -->
  <script>
    function onGigyaServiceReady() {
      window.ownid.init({
        URLPrefix: '<serverURL>', //Example: https://demo.ownid.com/ownid/
      });

      window.ownid.gigya.screenSets.addEventHandlers();
    }
  </script>

  <script async defer src="https://cdn.ownid.com/js/gigya-sdk.es5.js"></script>
</body>
```

#### Enabling JavaScript events

**NOTE**
For this integration, you must use the UI Builder JavaScript events functionality in the Console.
***

1. Go to your "Screen-Sets" collection in the Gigya console
2. Click on your <_prefix_>-RegistrationLogin collection
3. Choose the Javascript tab (center of the screen)
4. Modify the following screen JS events

```javascript
    onSubmit: function(event) {
      //here you can add custom code non-related to OwnID
      return window.ownid.gigya.screenSets.onSubmit(event).then((e) => console.log('window.ownid.onSubmit', e));
    },
    onAfterScreenLoad: function(event) {
      //here you can add custom code non-related to OwnID
      window.ownid.gigya.screenSets.onAfterScreenLoad(event, (e) => console.log('window.ownid.onAfterScreenLoad', e));
    },
    onHide: function(event) {
      //here you can add custom code non-related to OwnID
      window.ownid.gigya.screenSets.onHide();
    }
```

### APIs Integration

#### Quick start
#### 1. Add a DOM container to the HTML

Open HTML page you want to edit. Add an empty `<div>` tag to mark the spot where you want to display OwnID widget.

```html
<!-- ... existing HTML ... -->
<div id="ownid"></div>
<!-- ... existing HTML ... -->
```
Where `id="ownid"` allows to find OwnID container from the JavaScript code later and display OwnID widget inside of it.

#### 2. Add the Script Tag

Add `<script>` tag to the HTML page right before the closing `</body>` tag

```html
  <!-- ... other HTML ... -->
  <script async defer src="https://cdn.ownid.com/js/gigya-sdk.es5.js"></script>
</body>
```

#### 3. Create OwnID widget

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
      window.ownid.init({
        URLPrefix: '<serverURL>', //Example: https://demo.ownid.com/ownid/
      });

      window.ownid.render({
        type: 'register',
        element: document.querySelector('#ownid'),
        inline: {
          targetElement: document.querySelector('#password')
        }
      }); 
    }
  </script>
  <script async defer src="https://cdn.ownid.com/js/gigya-sdk.es5.js"></script>
</body>
```
This code will add OwnID widget to the `#ownid` container

### Sample code

#### Registration

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

#### Login

Next code will show how to integrate the OwnID login widget into your site.

After user completes the OwnID flow, login will proceed on the backend side.
Backend will return login cookies, then you will need to set them and navigate to the next page.

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

#### Recover

Next code will show how to integrate OwnID recover widget into your site.

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

#### Link Account

You can link your existing account with OwnID. It will enable passwordless login for you.

Next code will show how to integrate OwnID link widget into your site.

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
