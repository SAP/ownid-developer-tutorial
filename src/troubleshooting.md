### Checking connectivity with the Server

To check if your server is up and running, you can make a curl request:

```curl
curl -d '{"type":"register"}' https://<serverURL>/ownid -i
```

If you get a "200 OK" response that includes the url, context, nonce and expiration in the payload, your connectivity to the server was successful.

```json
{"url":"https://sign.ownid.com/sign?q=<serverURL>.ownid/f-CIx55TmEmFjA6OzMhm-g/start","context":"f-CIx55TmEmFjA6OzMhm-g","nonce":"717ba8c6-5304-492d-a3c8-675c7be5b7e4","expiration":600000}
```
