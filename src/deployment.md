
## Developer environment
The following steps will guide you to create a development environment running on your local machine.



## Productive environment
The following steps refer to environment where OwnID host the server and Gigya is the Identity Management System.

1. Hosted server

OwnID person will ask you for some parameters. 

Access to Gigya:
- Gigya API key and secret

Application parameters presented in the WebApp:
- Application name
- Application description
- Application icon

FIDO2 (biometric authentication):
- TBD

2. CNAME
URLs in the environment include:
* company.com - your website
* passwordless.company.com - where the customer register with phone lock mechanism
* sign.ownid.com - OwnID webapp
* company.ownid.com - hosted server

3. UI integration
Follow the instructions for Gigya integration 

4. Verify
See that OwnID widget is presented in your login/register pages.
Test the scenarios in mobile and in desktop:
* Register
* Login
* Can't login
* Link account - to test it, use a device that does not have a digital identity yet



