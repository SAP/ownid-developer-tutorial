## Overview

Welcome to the developer's guide and documentation portal of OwnID by SAP.

OwnID by SAP offers a passwordless login alternative to your website by using cryptographic keys to replace the traditional password. The public part of the keys is stored in your Identity System while the private part is stored on the mobile device. As a result, the user's phone becomes their method of login.

When a user accesses your website on their mobile device, all interactions will be carried out directly on the user's phone. However, when accessing a website on desktop, the user will be presented with a QR code - which they will need to scan via their mobile device's camera to unlock their account.

OwnID by SAP includes the following components:
* Widget for you integrate in your website
* WebApp that run on the user mobile device
* Server that communicates with your Identity System. The server can be created by the customer using OwnID SDK or OwnID can host a server for you

Please note: OwnID does not store any data. The credentials are stored on the user’s mobile and your Identity System. 

![architecture](_media/ownid-how-it-works.png)

OwnID supported scenarios:
* Register
* Login
* Can't login
* Link account when a user clicks on the OwnID widget in the login page, but the user is not registered to OwnID yet. In this scenario the user will be asked to enter their password for the last time to activite OwnID for all future logins.  

If your Identity System is SAP CDC (Gigya), follow the integration section [here](/gigya.md). 


## Securing your credentials
FIDO2 is a specification of the non-commercial FIDO Alliance which aim to eliminate passwords on the web. When FIDO2 is deployed the user is being asked to identify with the phone's lock mechanism.

If a user's mobile device supports FIDO2 then OwnID will trigger this as the method of authentication. In this scenario OwnID will use the FIDO2 API in the JavaScript code. The public key is stored on the user's profile in the Identity Management System.

When FIDO2 is not supported, a key pair is created and stored in the mobile device's browser storage. The public part of the key is stored in the user profile in the Identity Management System (similar to the public part of FIDO2). If a user’s  mobile device lock mechanism is not activated, OwnID will make the recommendation to activate it.  


