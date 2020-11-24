## Server overview

The server communicates with the Identity Management System in order to authenticate the user with the cryptographic keys stored on the mobile device and created by either FIDO2 or Web Crypto API. 

The server can be implemented in one of the following options:
- OwnID hosts the server for you
- OwnID provides you with a docker container and you host it
- OwnID provides you with SDK so you can integrate the code into your website's back-end

The following sections will explain how to implement each of the aforementioned options.


## Development technology
The server SDK is developed using .NET 5.0 
You have to keep that in mind when considering SDK code implementation.

## Server configuration

Setting the configuration is relevant only if you implement the SDK or host the docker container yourself. When OwnID hosts the server, you do not have to take any furhter steps.

When implementing the server SDK, the configuration is taken from appsettings.json or you can also set any parameter as an environment variable. Setting the parameters in appsettings.json can be either done manually or using a configuration tool that will guide you per parameter.

When your server is running in a docker container, you have to set the configuration in a Yaml file.

The table below explains the parameters you have to include in the configuration (whether it is appsettings.json or the Yaml file).

| Parameter Name | Type | Required (+) / Default value | Comments |
|:-:|:-:|:-:|:-:|
| callback_url | string | + | Public server (with OwnID Server SDK) url |
| pub_key | string | + | RSA public key for signing JWT token.<br>Value can be a raw content of RSA key file or a path to such file |
| private_key | string | + | RSA private key for signing JWT token.<br>Value can be a raw content of RSA key file or a path to such file |
| did | string | + | Unique string to identify your website |
| name | string | + | The name that a user will see in OwnID WebApp |
| description | string |  | The description that a user will see in OwnID WebApp |
| icon | string | + | The icon that a user will see in OwnID WebApp. |
| top_domain | string | + | callback_url and fido2_passwordless_page_url parent domain. |
| add_cors_origins | string |  | Additional origins that will be allowed to request OwnID Server SDK |
| maximum_number_of_connected_devices | number | 1 | Maximum number of connected devices that user can add |
| cache_type | string | + | Redis or in memory web-cache |
| cache_config | string |  | Cache connection string (empty for in memory) |
| cache_expiration | number | 10 minutes | How long the cache can hold transaction data |
| authentication_mode | string | OwnIdOnly | Enables or restricts authenticators usage.<br>Possible values: OwnIdOnly, Fido2Only, All |
| fido2_passwordless_page_url | string | +(FIDO2 enabled) | Passwordless URL. Is Required if FIDO2 is enabled. |
| fido2_relying_party_id | string | default = <br>passwordless page url host | Customer website domain |
| fido2_relying_party_name | string | default = <br>name | Customer name |
| fido2_user_display_name | string | Skip the password | Register / Login as this user name |
| fido2_user_name | string | default = <br>user display name | Register / Login as this user identifiactor |
| fido2_origin | string | default = <br>passwordless page url | Website address |

Gigya parameters:

| Parameter Name | Type | Required (+) / Default value | Comments |
|:-:|:-:|:-:|:-:|
| data_center | string | + | Gigya data center |
| secret | string | + | Gigya secret |
| api_key | string | + | Gigya API key |
| user_key | string |  | Gigya user key |
| login_type | string | session | What should be the result of success login.<br>Possible values: session or IdToken (which is JWT) |
  
  
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
    "top_domain": "my-company.com",
    "callback_url": "https://server.my-company.com",
    "did": "did:my-company:151850889514",
    "name": "My Company",
    "description": "Description here",
    "cache_type": "redis",
    "cache_config": "localhost:6379",
    "overwrite_fields": false,
    "authentication_mode": "All",
    "fido2_passwordless_page_url": "https://passwordless.my-company.com",
    "pub_key": "./keys/key.public",
    "private_key": "./keys/key.private"
  },
```

An Example for Yaml configuration file can be found in the docker container.


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

Go to `StartUp.cs`. Find `ConfigureServices` method and use `AddOwnId(...)` extension at the start to add mandatory services and attach  `UserProfile` and `UserHandler`.

SetKeys method can be removed as well as methodWithBaseSettings, if you set up the fields in appsettings.json (manually or using the configuration tool). The configuration tool can either be used to create the key pair only or to get user input for all necessary parameters and set them in appsettings.json.

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
                x.CallbackUrl = new Uri("https://my-app.com"); // public Uri to this app
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

This refers to 'forgot password' flow. When a user opens the  'reset password' page, they see the OwnID widget to provide an alternative passwordless login at this point.
If you are using Gigya (SAP CDC) then this server functionality is already implemented.

Required actions

To enable recovery functionality, you need to

1. Implement `IAccountRecoveryHandler` interface
2. Enable Recovery feature

#### Implement `IAccountRecoveryHandler` interface

To inject your custom logic to recovery process, you need to implement `OwnID.Extensibility.Flow.Abstractions.IAccountRecoveryHandler` interface

It contains 2 methods:

* `RecoverAsync` - code which is being executed after user scan OwnID QR code or click on OwnID link (step 5). Must contains reset token validation logic. You can pass any required information from the client side within `payload` argument. Usually, it contains serialized object with reset account token which make it possible to identify the user who is going to reset access to account. Must returns user identifier and profile.
* `OnRecoverAsync` - executing after OwnID generated new public key (step 7). Main purpose of this method is to reset old access credentials (OwnID public keys) and save newly generated public key to user profile to enable future authorization.

#### Enable Recovery feature

To enable Recovery feature, you need to call `builder.UseAccountRecovery` and pass class which implements interface as a type parameters at `Startup.ConfigureServices` method:

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

Notice `CustomAccountRecoveryHandler` in the code example is a custom implementation of `IAccountRecoveryHandler`


### Advanced settings
All configuration settings should be provided in AddOwnId(...) extension method on ConfigureServices application stage. Possible ways of the configuration tuning will be listed below.

#### Configuration parameters
Configuration parameters can either be set in appsettings.json (manually or using the configuration tool). The configuration tool collects user input for all the necessary parameters and sets them in appsettings.json. Alternatively, use method `WithBaseSettings`.

```cs
public void WithBaseSettings([NotNull] Action<IOwnIdCoreConfiguration> modifyAction)
```

#### Localization settings
All OwnIdSdk parts that require localization use `ILocalizationService` abstraction. 
As for `OwnID.Web` we created its implementation called `LocalizationService`. The implementation receives the text that should be localized and tries to find it as a key in the resource you defined or in default OwnId localization.  
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
The OwnId SDK needs a fast-reading store to place temporary authorization data. By default, it uses in-memory primitive store, but you can easily override this logic by implementing an `ICacheStore` interface and registering its implementation in the configuration builder with the `UseCacheStore` method.
```cs
public void UseCacheStore<TStore>(ServiceLifetime serviceLifetime) where TStore : class, ICacheStore
```
Where `TStore` is your custom store interaction implementation. It has primitive operations such as: set, find and remove. 
The `ServiceLifetime` is enum and will describe its lifecycle in an injection mechanism.

### Setting custom errors
The OwnID server SDK catches all unhandled exception. No unhandled exception is being transferred.

Should that happen, then you need to validate some user inputs (for example, during registration process), you can use `IUserProfileFormContext`, which is being passed to all extension points that support custom error processing.

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
When using the container in your environment, you only need to set the configuration part. When OwnID hosts your container, OwnID will also set up your configuration.

