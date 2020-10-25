### Checking connectivity with the Server

To check if your server is up and running, you can make a curl request:

```curl
curl -d '{"type":"register"}' https://<serverURL>/ownid -i
```

If you get a "200 OK" response that includes the url, context, nonce and expiration in the payload, your connectivity to the server was successful.

```json
{"url":"https://sign.ownid.com/sign?q=<serverURL>.ownid/f-CIx55TmEmFjA6OzMhm-g/start","context":"f-CIx55TmEmFjA6OzMhm-g","nonce":"717ba8c6-5304-492d-a3c8-675c7be5b7e4","expiration":600000}
```

### Identity not found on the mobile device
1. In case you worked with the desktop and scanned the QR code with an app that open the URL in the scanner app (i.e. WebView) the credentials are not maintained

2. The identity is browser related so in case you created your identity with Samsung Internet and later access the website with Chrome, the identity will not be available

3. Have you cleared your browser data?

In any scenario of lost credentials, please follow the 'can't login' flow to re-create your credentials.

