## Overview

**Welcome to the developer's guide and documentation portal of OwnID by SAP!**

OwnID by SAP offers a passwordless login alternative to your website by using cryptographic keys to replace the traditional password. The public part of the keys is stored in your Identity System while the private part is stored on the mobile device. As a result, the user's phone becomes their method of login.

When a user accesses your website on their mobile device, all interactions will be carried out directly on the user's phone. However, when accessing a website on desktop, the user will be presented with a QR code - which they will need to scan via their mobile device's camera to unlock their account.

Please note: OwnID does not store any data. The credentials are stored on the user’s mobile and your Identity System. 

![architecture](_media/ownid-how-it-works.png)

OwnID supported scenarios:

* Register
* Login
* Can't login (forgot or lost my device)
* Link account when a user clicks on the OwnID widget in the login page, but the user is not registered to OwnID yet. In this scenario the user will be asked to enter their password for the last time to activite OwnID for all future logins.  

If your Identity System is SAP Customer Data Cloud (Gigya), follow the integration section [here](/gigya.md).

## Core Components

OwnID by SAP includes the following core components:

* [OwnID Web SDK](/frontend-sdk.md) - Provides a widget that you can integrate in your websites.
* [OwnID Server](/server-sdk.md) - A Backend component responsible to communicate with your Identity Management System.
  
## Integrations

* [SAP Customer Data Cloud](/gigya.md)
