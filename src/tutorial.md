# Tutorial
This is a step-by-step Guide to create a working application

## Download demo application
Download or clone demo application from [OwnID GitHub repository](https://github.wdf.sap.corp/OwnID/developer-tutorial).

## Install dependencies
Use `npm install` to install dependencies.
Then use `npm start` to run sample application.

Or `npm start:demo` to run demo application with already integrated OwnID.

## OnnID integration

### Registration
Open `tutorial/registration.html` file.

Add OwnID library to the end of the file just before closing body tag.

```html
  <script async defer src="https://cdn.ownid.com/js/gigya-sdk.es5.js"></script>
</body>
```

Then we need to add OwnID widget wrapper. Place it after a confirm password field (This is not required position.
You can place it everywhere in the body tag). 

```html
      <input class="own-input" type="password" placeholder="Confirm Password" id="confirm-password">

      <div id="ownid"></div>

      <button class="own-button" type="submit">Create Account</button>
```

Next step is adding widget itself. Add next code before closing head tag.

```html
  <script>
      window.ownidAsyncInit = function() {
          ownid.init({
              URLPrefix: 'https://passwordless.pilot.ownid.com/ownid/'
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
  </script>
</head>
```

Then we should change submit form behaviour. 
Define `onRegisterWithOwnID` function.

```html
  <script>
      function onRegisterWithOwnID() {
          var data;
          var firstName = document.querySelector('#first-name').value;
          var email = document.querySelector('#email').value;
          var password = document.querySelector('#password').value;
          var errors = document.querySelector('.errors');
          errors.classList.remove('show');

          ownid.getOwnIDPayload(window.ownidWidget).then(function (ownidPayload) {
              if (ownidPayload.error) {
                  errors.classList.add('show');
                  errors.textContent = ownidPayload.message;
                  return;
              }

              if (ownidPayload.data) {
                  password = window.ownid.generateOwnIDPassword(12);
                  data = {
                      ownIdConnections: [
                          ownidPayload.data,
                      ],
                  };
              }

              window.gigya.accounts.initRegistration({
                  callback: function (response) {
                      window.gigya.accounts.register({
                          regToken: response.regToken,
                          email: email,
                          password: password,
                          profile: {
                              firstName,
                          },
                          data: data,
                          finalizeRegistration: true,
                          callback: function (res) {
                              if (res.status === 'FAIL') {
                                  errors.classList.add('show');
                                  errors.textContent = res.errorDetails;

                                  return;
                              }

                              window.location = '/account.html';
                          }
                      });
                  },
              });
          });
      }
  </script>
```

Replace calling `onRegister()` with `onRegisterWithOwnID()` function.

```html
    <form class="own-form" onsubmit="onRegisterWithOwnID(); return false;">
```

That's it! Registration widget will appear at password field of the form.

### Login
Almost same as registration. 
Open `tutorial/login.html` file.

Add OwnID library to the end of the file just before closing body tag.

```html
  <script async defer src="https://cdn.ownid.com/js/gigya-sdk.es5.js"></script>
</body>
```

Then we need to add OwnID widget wrapper. Place it after a password field. 

```html
<input class="own-input" type="password" placeholder="Password" id="password">

<div id="ownid"></div>

<div class="popup-text">
```

Next step is adding widget itself. Add next code before closing head tag.

```html
  <script>
      window.ownidAsyncInit = function() {
          ownid.init({
              URLPrefix: 'https://passwordless.pilot.ownid.com/ownid/'
          });

           window.ownidWidget = ownid.gigya.render({
                type: 'login',
                element: document.querySelector('#ownid'),
                inline: {
                    userIdElement: document.querySelector('#email'),
                    targetElement: document.querySelector('#password'),
                    offset:[-10, 0]
                },
                onLogin: function (data) {
                    if (data.sessionInfo) {
                        document.cookie = `${data.sessionInfo.cookieName}=${data.sessionInfo.cookieValue}; path=/`;
  
                        window.location = '/account.html';
                    }
                }
            });
      }
  </script>
</head>
```

Then we should change submit form behaviour. 
Define `onLoginWithOwnID` function.

```html
<script>
    function onLoginWithOwnID() {
        var email = document.querySelector('#email').value;
        var password = document.querySelector('#password').value;
        var errors = document.querySelector('.errors');
        errors.classList.remove('show');
        
        window.gigya.accounts.login({
            loginID: email,
            password: password,
            callback: function (res) {
                if (res.status === 'FAIL') {
                    errors.classList.add('show');
                    errors.textContent = res.errorDetails;
        
                    return;
                }
                window.ownid.getOwnIDPayload(window.ownidWidget).then(function (statusRS) {
                    if (statusRS.data) {
                        window.gigya.accounts.getAccountInfo({
                            include: 'data',
                            callback: function (userData) {
                                var ownIdConnections = userData.data.ownIdConnections || [];
        
                                ownIdConnections.push(statusRS.data);
        
                                window.gigya.accounts.setAccountInfo({
                                    data: {
                                        ownIdConnections: ownIdConnections
                                    },
                                    callback: function () {
                                        window.location = '/account.html';
                                    }
                                });
                            },
                        });
                    }
                });
            }
        });
    }
</script>
```

Replace calling `onLogin()` with `onLoginWithOwnID()` function.

```html
    <form class="own-form" onsubmit="onLoginWithOwnID(); return false;">
```

That's it! Login widget will appear at password field of the form.

### Reset password

Open `tutorial/reset-password.html` file.

Add OwnID library to the end of the file just before closing body tag.

```html
  <script async defer src="https://cdn.ownid.com/js/gigya-sdk.es5.js"></script>
</body>
```

Then we need to add OwnID widget wrapper. Place it after a confirm password field. 

```html
<input class="own-input" type="password" placeholder="Confirm Password" id="confirm-password">

<div id="ownid"></div>

<button class="own-button" type="submit">Set new Password</button>
```

Add next code before closing head tag.

```html
  <script>
      window.ownidAsyncInit = function() {
           ownid.init({
               URLPrefix: 'https://passwordless.pilot.ownid.com/ownid/'
           });
 
           ownid.render({
               type: 'recover',
               element: document.querySelector('#ownid'),
               data: { pwrt: getUrlParameter('pwrt') },
               inline: {
                   targetElement: document.querySelector('#password'),
                   additionalElements: [document.querySelector('#confirm-password')],
                   offset: [-10, 0]
               },
               onRecover: function () {
                   window.location = '/login.html';
               }
           });
       }
  </script>
</head>
```
Recover widget will appear at password field of the form.

### Link Account

Open `tutorial/account.html` file.

Add OwnID library to the end of the file just before closing body tag.

```html
  <script async defer src="https://cdn.ownid.com/js/gigya-sdk.es5.js"></script>
</body>
```

Then we need to add OwnID widget wrapper. Place it before an email field. 

```html
<div class="profile"></div>

<div id="ownid"></div>

<input class="own-input" type="email" placeholder="Email" id="email" readonly/>
```

Add next code before closing head tag.

```html
  <script>
      window.ownidAsyncInit = function() {
          ownid.init({
              URLPrefix: 'https://passwordless.pilot.ownid.com/ownid/'
          });

          window.ownidWidget = ownid.render({
              type: 'link',
              element: document.querySelector('#ownid'),
          });
      }
  </script>
</head>
```
Link widget will appear before email field.
