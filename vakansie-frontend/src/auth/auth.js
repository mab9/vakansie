import "../../keycloak.js"

export {AuthController}

console.info("auth 1")

/**
 * @typedef AuthController
 * @property {Function} login
 * @property {Function} logout
 */
const authController = () => {

//     keycloak.init({
//            onLoad: 'login-required' // login-required will authenticate the client if the user is logged-in to vakansie or display the login page if not.
//        }).then(function (authenticated) {
//            // After the user is authenticated the application can make
//            // requests to RESTful services secured by vakansie by including the bearer token
//            // in the Authorization header.
//            console.info(authenticated ? 'authenticated' : 'not authenticated');
//            // keycloak.token
//
//            const jwtPayload = JSON.parse(atob(keycloak.token.split(".")[1]));
//            const userIdKeycloak = jwtPayload.sub;
//            const userName = jwtPayload.name;
//            const userEmail = jwtPayload.email;
//            render(authenticated);
//        }).catch(function () {
//            alert('failed to initialize');
//        });


    const keycloak = new Keycloak("./keycloak.json");

    /*
        login-required will authenticate the client
        if the user is logged-in to vakansie or display the login page if not.
     */
    const login = () => {

        keycloak.onAuthSuccess = function () {
            alert('yepy yeho');
        }
        keycloak.onAuthError = function () {
            alert('login error yeho');
        }
        keycloak.onAuthRefreshSuccess = function () {
            alert('onAuthRefreshSuccess');
        }
        keycloak.onAuthRefreshError = function () {
            alert('onAuthRefreshError');
        }


        // onReady(authenticated) - Called when the adapter is initialized.
        // onAuthSuccess - Called when a user is successfully authenticated.
        // onAuthError - Called if there was an error during authentication.
        // onAuthRefreshSuccess - Called when the token is refreshed.
        // onAuthRefreshError - Called if there was an error while trying to refresh the token.
        // onAuthLogout - Called if the user is logged out (will only be called if the session status iframe is enabled, or in Cordova mode).
        // onTokenExpired - Called when the access token is expired. If a refresh token is available the token can be refreshed with updateToken, or in cases where it is not (that is, with implicit flow) you can redirect to login screen to obtain a new access token.


        return keycloak.init({
            onLoad: 'login-required'
        })
    }

    const logout = () => {
        keycloak.logout();
    }

    return Object.freeze({
        login,
        logout,
    })
}

const AuthController = authController();
