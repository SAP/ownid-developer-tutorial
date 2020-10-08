# OwnID for Developers <!-- {docsify-ignore} -->

> Welcome to the developer's guide and documentation portal of OwnID by SAP.

# Overview
Here we need to explain the high level overview of our architecture and complement that with a nice architecture diagram where we show clearly frontend, backend and the interactions between those components. 

# Prerequisites

In order to integrate OwnID in your SAP Customer Data Cloud website, make sure you cover the following pre-requisites:

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

## Set Default Registration and Login Screen-Sets

To select the default "RegistrationLogin" screen-set you wish to use in web and mobile, please follow [this](https://developers.gigya.com/display/GD/Policies#Policies-DefaultLoginandRegistrationScreen-Set) instructions.


# OwnID Server SDK

## Hosting Server SDK - Optional

### Docker Container

The idea is to provide a docker container

### YAML Configuration File

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: <company-name>-deployment # <client-name> - name of company, for example SAP
  namespace: alpha
  labels:
    app: <company-name>
spec:
  revisionHistoryLimit: 1
  replicas: 2
  selector:
    matchLabels:
      app: <company-name>
  template:
    metadata:
      labels:
        app: <company-name>
    spec:
      containers:
        - name: <company-name>
          image: <ownid-image-url> # path to image, ex: 571861302935.dkr.ecr.us-east-2.amazonaws.com/ownid-server-netcore3-gigya-staging:latest
          ports:
            - containerPort: 5002
          env:
            - name: OWNID__CALLBACK_URL
              value: https://<client-name>.ownid.com # public domain name of this deployment - ingress of CNAME
            - name: OWNID__DID # Unique website identifier
              value: did:<client-name>:<did>
            - name: OWNID__NAME # Website name - will be shown on https://sign.ownid.com
              value: <Client name>
            - name: OWNID__DESCRIPTION # Website description - will be shown on https://sign.ownid.com
              value: <client description>
            - name: OWNID__ICON # Website icon - will be shown on https://sign.ownid.com
              value: <client icon base64>
            - name: OWNID__CACHE_TYPE # Type of cache - redis of web-cache (in memory solution for 1 instance of service)
              value: redis
            - name: OWNID__CACHE_CONFIG # Cache config. For redis - redis_uri
              value: <redis uri>
            - name: OWNID__PUB_KEY # Website public key 
              value: <website public key>
            - name: OWNID__PRIVATE_KEY # Website private key 
              value: <website private key>
            - name: OWNID__FIDO2_ENABLED # true, if you want to enable FIDO2 support
              value: <true or false>
            - name: OWNID__FIDO2_PASSWORDLESS_PAGE_URL # should be a subdomain. OwnID team has to create a certifificate for the URL
              value: https://passwordless.<website domain>
            - name: OWNID__FIDO2_RELYING_PARTY_ID # Website domain name
              value: universalid.sap.com
            - name: OWNID__FIDO2_RELYING_PARTY_NAME # Website domain name
              value: UniversalID
            - name: OWNID__FIDO2_ORIGIN # Website address
              value: https://universalid.sap.com
            - name: GIGYA__DATA_CENTER # Gigya data center
              value: us1.gigya.com
            - name: GIGYA__SECRET # Gigya secret
              value: <gigya secret>
            - name: GIGYA__API_KEY # Gigya api key
              value: <gigya api key>
            - name: GIGYA__USER_KEY # Gigya user key
              value: <gigya user key>
            - name: GIGYA__LOGIN_TYPE # Login type: session or IdToken (JWT will be returned instead of creating a session)
              value: IdToken
            - name: ASPNETCORE_ENVIRONMENT # environment
              value: alpha
```

### Checking connectivity with the Server

To check if your server is up and running, you can make a curl request:

```curl
curl -d '{"type":"register"}' https://<serverURL>/ownid -i
```

If you get a "200 OK" response that includes the url, context, nonce and expiration in the payload, your connectivity to the server was successful.

```json
{"url":"https://sign.ownid.com/sign?q=<serverURL>.ownid/f-CIx55TmEmFjA6OzMhm-g/start","context":"f-CIx55TmEmFjA6OzMhm-g","nonce":"717ba8c6-5304-492d-a3c8-675c7be5b7e4","expiration":600000}
```

# OwnID Frontend SDK

## Initialize the SDK

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

## Integrate OwnID in your ScreenSets

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
