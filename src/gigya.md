# SAP Customer Data Cloud Integration

In order to integrate OwnID in your SAP Customer Data Cloud website, make sure you cover the following prerequisites:

- Permissions to run the following Gigya REST API endpoints:
  - accounts.setSchema
  - accounts.setAccountInfo
  - accounts.getAccountInfo
  - accounts.notifyLogin
  - accounts.getJWTPublicKey
  - accounts.resetPassword
  - accounts.deleteAccount

- Gigya console access (https://console.gigya.com/)

## Generating Gigya Auth Keys

Most REST API requests to Customer Data Cloud should be made securely, using an authentication mechanism. Using an application key and secret is one of the recommended methods by SAP Customer Data Cloud and requires creating an application on the Console, that is associated with a permission group.

To generate an application key and secret to allow OwnID to perform REST API requests to SAP Customer Data Cloud, please check the instructions [here](https://developers.gigya.com/display/GD/Signing+Requests+to+SAP+Customer+Data+Cloud#SigningRequeststoSAPCustomerDataCloud-ApplicationandUserKeys).

## Configuring Gigya Schema

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

## Set Default ScreenSets

To select the default "RegistrationLogin" screen-set you wish to use in web and mobile, please follow [this](https://developers.gigya.com/display/GD/Policies#Policies-DefaultLoginandRegistrationScreen-Set) instructions.

## Initialize OwnID SDK

Run `ownid.init` to initialize the widget in your Login, Registration, and Forget Password pages. example:

```html
  <!-- ... other HTML ... -->
  <script>
    function onGigyaServiceReady() {
     ownid.init({
       URLPrefix: '<serverURL>', //Example: https://demo.dev.ownid.com/ownid/
     });
    }
  </script>

  <script async defer src="https://cdn.ownid.com/js/gigya-sdk.es5.js"></script>
</body>
```

## Enabling JavaScript events

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