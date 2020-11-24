window.onRegister = function () {
    var firstName = document.querySelector('#first-name').value;
    var email = document.querySelector('#email').value;
    var password = document.querySelector('#password').value;
    var errors = document.querySelector('.errors');
    errors.classList.remove('show');

    window.gigya.accounts.initRegistration({
        callback: function (response) {
            window.gigya.accounts.register({
                regToken: response.regToken,
                email: email,
                password: password,
                profile: {
                    firstName,
                },
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
}

window.onLogin = function () {
    var email = document.querySelector('#email').value;
    var password = document.querySelector('#password').value;
    var errors = document.querySelector('.errors');
    errors.classList.remove('show');

    window.gigya.accounts.login({
        loginID: email,
        password,
        callback: function (res) {
            if (res.status === 'FAIL') {
                errors.classList.add('show');
                errors.textContent = res.errorDetails;

                return;
            }

            window.location = '/account.html';
        }
    });
}

window.onForgotPassword = function () {
    var email = document.querySelector('#email').value;
    var errors = document.querySelector('.errors');
    errors.classList.remove('show');

    window.gigya.accounts.resetPassword({
        loginID: email,
        callback: function (res) {
            if (res.status === 'FAIL') {
                errors.classList.add('show');
                errors.textContent = res.errorDetails;

                return;
            }

            document.querySelector('.email-sent--email').textContent = email;
            document.querySelector('.email-not-sent').style.display = 'none';
            document.querySelector('.email-sent').style.display = 'flex';
        }
    });
}

window.onResetPassword = function () {
    var pwrt = window.getURLParam('pwrt');
    var password = document.querySelector('#password').value;
    var errors = document.querySelector('.errors');
    errors.classList.remove('show');

    window.gigya.accounts.resetPassword({
        passwordResetToken: pwrt,
        newPassword: password,
        callback: function (res) {
            if (res.status === 'FAIL') {
                errors.classList.add('show');
                errors.textContent = res.errorDetails;

                return;
            }

            window.location = '/login.html';
        }
    });
}

window.onLogout = function () {
    window.gigya.accounts.logout({
        callback: function () {
            window.location = '/login.html';
        }
    });
}

window.onLoadAccount = function () {
    window.gigya.accounts.getAccountInfo({
        callback: function (res) {
            if (res.status === 'FAIL') {
                window.location = '/login.html';
                return;
            }
            document.querySelector('.profile').textContent = 'Welcome ' + res.profile.firstName + '! You are logged in.';
            document.querySelector('#email').value = res.profile.email;
        }
    });
}



window.getURLParam = function (paramName) {
    var url = window.document.location.search.replace('?', '');
    var urlParts = url.split('&');
    var paramsList = {};

    urlParts.forEach((urlPart) => {
        var paramArr = urlPart.split('=');
        paramsList[paramArr[0]] = paramArr[1];
    });

    return paramsList[paramName];
}

window.getUrlParameter = function (paramName) {
    var url = document.location.search.replace('?', '');
    var urlParts = url.split('&');
    var paramsList = {};

    urlParts.forEach((urlPart) => {
        var paramArr = urlPart.split('=');
        paramsList[paramArr[0]] = paramArr[1];
    });

    return paramsList[paramName] || null;
}