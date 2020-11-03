## Server overview

The server communicates with the Identity Management System in order to authenticate the user with the cryptographic keys created by either FIDO2 or Web Crypto API and are stored on the mobile device. 

The server can be implemented in one of the following three options:
- OwnID host it for you
- OwnID provide you with a docker container and you host it
- OwnID provide you with SDK so you can integrate code into your website back-end

The following sections will explain how to implement each of the three.


## Development technology
The server SDK is developed using .NET Core 3.1. 
You have to take that in mind when considering to implement the SDK code.


## Server configuration

Setting the configuration is relevant only if you implement the SDK or host the docker container yourself. When OwnID host the server, you have nothing to do.

When implementing the server SDK, the configuration is taken from appsettings.json or you can also set any parameter as an environment variable. Setting the parameters in appsettings.json can be either manually or using the configuration tool that will guide you per parameter.

When your server is running in a docker container, you have to set the configuration in Yaml file.

The table explain the parameters you have to include in the configuration (whether it is appsettings.json or the Yaml file).

| Parameter Name | Type | Value Example | Comments |
|:-:|:-:|:-:|:-:|
| callback_url | string | "https://<client-name>.ownid.com" |  |
| pub_key | string | "./keys/jwtRS256.key.pub" | path to the public key. In containers can be reference to an entry in the secure storage |
| private_key | string | "./keys/jwtRS256.key" |  |
| did | string | "did:ownid:151850889514" | unique string to identify your website |
| name | string | "SAP" | the name that the user will see in OwnID WebApp |
| description | string | "SAP SE" | the description that the user will see in OwnID WebApp |
| icon | string | "" | icon base64 |
| cache_expiration | number | 600000 | how long the cache can hold transaction data |
| cache_type | string | "redis" | redis or in memory web-cache |
| cache_config | string | "http://yourredis" | redis uri. If not redis leave empty |
| fido_enabled | boolean | true/false | FIDO2 enabled |
| fido2_passwordless_page_url | string | https://passwordless.customer.com | passwordless URL |
| fido2_relying_party_id | string | customer.com | customer website domain |
| fido2_relying_party_name | string | customer | customer name |
| fido2_user_display_name | string | passwordless | register as this user name |
| fido2_user_name | string | passwordless | register as this user name |
| fido2_origin | string | https://customer.com | website address |  

Gigya parameters:

| Parameter Name | Type | Value Example | Comments |
|:-:|:-:|:-:|:-:|  
| data_center | string | us1.gigya.com | Gigya data center |  
| secret | string |  | Gigya secret |  
| api_key | string |  | Gigya API key |  
| user_key | string |  | Gigya user key |  
| login_type | string | IdToken | session or IdToken (which is JWT) |  
  
  
Example for appsettings.json section:

```
  "gigya": {
    "login_type": "",
    "secret": "",
    "user_key": "",
    "api_key": "",
    "data_center": "",
  },
  "ownid": {
    "web_app_url": "https://sign.ownid.com",
    "callback_url": "http://localhost:5002",
    "pub_key": "./keys/jwtRS256.key.pub",
    "private_key": "./keys/jwtRS256.key",
    "did": "did:ownid:151850889514",
    "name": "mozambiquehe.re",
    "description": "Description here",
    "cache_expiration": 600000,
    "cache_type": "web-cache",
    "cache_config": "localhost:6379",
    "authentication_mode": "OwnIdOnly",
    "fido2_passwordless_page_url": "",
    "fido2_relying_party_id": "",
    "fido2_relying_party_name": "",
    "fido2_user_display_name": "",
    "fido2_user_name": "",
    "fido2_origin": ""
  },
```

Example for Yaml configuration file can be found in the docker container.


## Server SDK
### Implementing the SDK
1. Create UserProfile class without any fields

```cs
public class UserProfile
{
}
```

2. Implement `IUserHandler<T>`
Need to implement `UserHandler<T>` interface to integrate custom logic into the OwnId authorization process.
You can create a parameterized constructor to get injected parameters. `IUserHandler<T>` instances have a `Transient` lifetime by default. Each method will be called after a user initiates any action (login, register, etc.)

```cs
public class UserHandler : IUserHandler<UserProfile>
{
    public Task UpdateProfileAsync(IUserProfileFormContext<UserProfile> context)
    {
        // some user update profile logic
    }

    public Task<LoginResult<object>> OnSuccessLoginAsync(string did)
    {
        // some user login logic
    }
}
```

3. Add OwnIdSdk services

Go to `StartUp.cs`. Find `ConfigureServices` method and use `AddOwnId(...)` extension at the start to add mandatory services and attach already `UserProfile` and `UserHandler`.

SetKeys method can be removed and also the following one, methodWithBaseSettings, if you set the fields in appsettings.json (manually or using the configuration tool). The configuration tool can either be used to create the key pair only or to get user input for all necessary parameters and set them in appsettings.json.

```cs
public void ConfigureServices(IServiceCollection services)
{
    services.AddOwnId( builder =>
        {
            // previously created UserProfile and UserHandler
            builder.UseUserHandlerWithCustomProfile<UserProfile, UserHandler>();

            // Adding RSA keys by path for JWT signing and application identification
            builder.SetKeys("./keys/my-public-key.pub", "./keys/my-private-key");

            // Set base settings
            builder.WithBaseSettings(x =>
            {
                x.DID = "<your application unique identifier>"; // helps to identify your application
                x.Name = "<your product name>"; // will be shown to users
                x.CallbackUrl = new Uri("https://my-app.com"); // public Uri to this net core app
                                                               // for sending login/register requests
            });
        });
}
```

4. Add OwnIdSdk middleware

Find `Configure` method in `StartUp.cs` and use `UseOwnId()` extension at the start to add register/login requests processors.

```cs
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    app.UseOwnId();
}
```

5. Can't login

This refer to 'forgot password' flow. When user open page 'reset password', they see OwnID widget to also offer password-less login at this point.
In case you are using Gigya then this server functionality is already implemented.

Required actions

To enable recovery functionality, you need to

1. Implement `IAccountRecoveryHandler` interface
2. Enable Recovery feature

#### Implement `IAccountRecoveryHandler` interface

To inject your custom logic to recovery process, you need to implement `OwnIdSdk.NetCore3.Extensibility.Flow.Abstractions.IAccountRecoveryHandler` interface

It contains 2 methods:

* `RecoverAsync` - code which is being executed after user scan OwnID QR code or click on OwnID link (step 5). Must contains reset token validation logic. You can pass any required information from the client side within `payload` argument. Usually, it contains serialized object with reset account token which make it possible to identify the user who is going to reset access to account. Must returns user identifier and profile.
* `OnRecoverAsync` - executing after OwnID generated new public key (step 7). Main purpose of this method is to reset old access credentials (OwnID public keys) and save newly generated public key to user profile to enable future authorization.

#### Enable Recovery feature

To enable Recovery feature, you need to call `builder.UseAccountRecovery` and pass class which implement interface as a type parameters at `Startup.ConfigureServices` method:

```cs
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        ...
        services.AddOwnId(builder => {
            ...
            builder.UseAccountRecovery<CustomAccountRecoveryHandler>();
            ...
        });
        ...
    }
}
```

Notice `CustomAccountRecoveryHandler` in the code example is custom implementation of `IAccountRecoveryHandler`


### Advanced settings
All configuration settings should be provided in AddOwnId(...) extension method on ConfigureServices application stage. Possible ways of the configuration tuning will be listed below.

#### Configuration parameters
Configuration parameters can either be set in appsettings.json (manually or using the configuration tool). The configuration tool get user input for all necessary parameters and set them in appsettings.json. Alternatively, use method `WithBaseSettings`.

```cs
public void WithBaseSettings([NotNull] Action<IOwnIdCoreConfiguration> modifyAction)
```

A list of these settings can be found in `IOwnIdCoreConfiguration` interface. We will describe them one by one below.

* `Uri` **`OwnIdApplicationUrl`** - OwnId application URI that will be used for authorization. Required. Should use HTTPS in production environments. Should be accessible by OwinId application endpoint. HTTP can only be used for development cases with `IsDevEnvironment` set to `true`

* `Uri` **`CallbackUrl`** -  Uri of OwnIdSdk host. Will be used for the entire OwnID challenge process. Required. Should use HTTPS on production environments. Should be accessible by OwinId application endpoint `OwnIdApplicationUrl`. HTTP can only be used for development cases with `IsDevEnvironment` set to `true`

* `RSA` **`JwtSignCredentials`** - RSA keys for signing JWT token that will be provided for OwnId application requests. Required. You could use helper methods in configuration builder to set keys from file `public void SetKeys([NotNull] string publicKeyPath, [NotNull] string privateKeyPath)` or pass the object by itself `public void SetKeys([NotNull] RSA rsa)`.

* `IProfileConfiguration` **`ProfileConfiguration`** - Profile form fields configuration. Should be set with `IUserHandler<T>` with 'UseUserHandlerWithCustomProfile<TProfile, THandler>()' method in configuration builder.

* `string` **`DID`** - Organization/ product unique identity. Helps to identify your application on par with the public key from `JwtSignCredentials` 

* `string` **`Name`** - Name of organization / product that will be shown to end user on OwinId application page on registration / login / managing profile.  Required.

* `string` **`Icon`** - Icon of organization / product that will be shown to end user on OwinId application page on registration / login / managing profile. Can be stored as URI or base64 encoded format string (`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==`)

* `string` **`Description`** - Description text that will be shown near the `Name` on OwnId application page for end-user

* `bool` **`IsDevEnvironment`** - Marks if OwnIdSdk is used for development cases

#### Localization settings
All OwnIdSdk parts that require localization use `ILocalizationService` abstraction. 
As for `OwnIdSdk.NetCore3.Web` we created its implementation called `LocalizationService`. It receives the text that should be localized and tries to find it as a key in the resource you define or in default OwnId localization. 
To provide localization resource you can use:
* `SetLocalizationResource` that sets custom localization resource (*.resx, etc.) by its type and name to be used in LocalizationService
```cs
public void SetLocalizationResource([NotNull] Type resourceType, [NotNull] string resourceName)
```
* `SetStringLocalizer` that sets IStringLocalizer to be used in LocalizationService
```cs
public void SetStringLocalizer<TLocalizer>() where TLocalizer : IStringLocalizer
```

#### Cache store settings
OwnId SDK need a fast-reading store to place authorization temporary data. By default, it uses in-memory primitive store, but you can easily override this logic by implementing `ICacheStore` interface and registering its implementation in configuration builder with method `UseCacheStore`.
```cs
public void UseCacheStore<TStore>(ServiceLifetime serviceLifetime) where TStore : class, ICacheStore
```
Where `TStore` is your custom store interaction implementation. It has primitive operations like set, find and remove. 
The `ServiceLifetime` is enum the will describe it's lifecycle in injection mechanism.

### Setting custom errors
OwnID server SDK catch all unhandled exception. No unhandled exception is being transferred.

In case then you need to validate some user inputs (for example, during registration process), you can use `IUserProfileFormContext`, which is being passed to all extension points which support custom error processing.

#### `SetGeneralError`

`SetGeneralError` should be used to provide general error, not related to any particular data provided by client

`SetGeneralError` example

```cs
public class CustomUserProfile<TProfile> : IUserHandler<TProfile> where TProfile : class
{
    ...
    public async Task UpdateProfileAsync(IUserProfileFormContext<TProfile> context)
    {
        ...
        bool isValid = ValidateProfile(context.Profile, out var error);
        if (!isValid)
        {
            context.SetGeneralError($"Profile is invalid: {error}");
            return;
        }
        ...
    }
    ...
}

```

#### `SetError`

`SetError` method should be used to provide field specific error. It can be used at:

* `IUserHandler.UpdateProfileAsync(IUserProfileFormContext<TProfile> context)`
* `IAccountLinkHandler.OnLink(IUserProfileFormContext<TProfile> context)`

`SetError` example

```cs
public class CustomUserProfile<TProfile> : IUserHandler<TProfile> where TProfile : class
{
    ...
    public async Task UpdateProfileAsync(IUserProfileFormContext<TProfile> context)
    {
        ...
        // check if email already exists
        bool emailExists = IsEmailExists(userId: context.DID, email: context.Profile.Email);
        if (emailExists)
        {
            context.SetError(profile => profile.Email, $"User with email '{context.Profile.Email}' already exists");
        }
        ...
    }
    ...
}

```

## Server container
When using the container in your environment, you only need to set the configuration part. When OwnID host your container, OwnID will also set your configuration.

