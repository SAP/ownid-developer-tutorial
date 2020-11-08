## Overview

Welcome to the developer's guide and documentation portal of OwnID by SAP.

OwnID by SAP offers a password-less login to your website. It is using cryptographic keys to replace the password. The public part of the keys is then being stored in your Identity System while the private part is stored on the mobile device. As a result, the mobile phone becomes the user’s method of login.

When a user access your website from the mobile, all the interaction with the user is in the mobile. However, when the user access your website from the desktop, they will be presented with QR code to be scanned by their mobile device.

OwnID by SAP include the following components:
* Widget you integrate in your website
* WebApp that run on the user mobile device
* Server that communicate with your Identity System. The server can be created by the customer using OwnID SDK or OwnID can host a server for you

Notice that OwnID does not store any data. The credentials are stored on the user’s mobile and your Identity System. 

![architecture](_media/ownid-how-it-works.png)

OwnID supported scenarios:
* Register
* Login
* Can't login
* Link account when user click OwnID widget in login page but did not register yet. In this scenario the user will be asked to enter password for the last time

If your Identity System is SAP CDC (Gigya), follow the integration part 


## Securing your credentials
FIDO2 is a specification of the non-commercial FIDO Alliance which aim to eliminate passwords on the web. When FIDO2 is deployed the user is being asked to identify with the mechanism being used to lock the phone.

With OwnID, when a user device found to support FIDO2 it will be used as the authentication method. In this scenario OwnID will use FIDO2 API in the JavaScript code. The public key is stored in the user profile in the Identity Management System.

When FIDO2 is not supported, key pair is created and stored in the mobile device browser storage. The public part of the key is stored in the user profile in the Identity Management System (similar to the public part of the FIDO2). OwnID notifies the user it is recommended to have the phone locked in case it is not.


