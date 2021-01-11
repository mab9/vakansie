import "../../keycloak.js"
import {Attribute, setValueOf, valueOf} from "../base/presentationModel/presentationModel.js";
import {maybe} from "../assets/util/maybe.js";

export {AuthController}

/**
 * @typedef AuthController
 * @property {Function} login
 * @property {Function} logout
 */
const authController = () => {

    const loggedIn = Attribute(false);
    // https://github.com/ahus1/keycloak-dropwizard-integration/blob/master/keycloak-dropwizard-bearer/src/main/resources/assets/ajax/app.js
    const keycloak = new Keycloak("./keycloak.json");

    const init = () => {
        keycloak.onReady = authenticated => setValueOf(loggedIn)(authenticated);
        // keycloak.onAuthSuccess = () => alert('onAuthSuccess'); // show privileged page //
        keycloak.onAuthError = () => setValueOf(loggedIn)(false); // show welcome page
        keycloak.onAuthRefreshSuccess = () => setValueOf(loggedIn)(true);
        keycloak.onAuthRefreshError = () => setValueOf(loggedIn)(false);  // show page x / login?

        keycloak.init({
            onLoad: 'check-sso'
        }).then(authenticated => {
            if (!authenticated) console.error("Could not authenticate client");
        }).catch(() => {
            console.error("Could not initalized client")
        });
    }

    const isLoggedIn = () => valueOf(loggedIn);

    /*
        Login-required option will authenticate the client
        if the user is logged-in to vakansie or (otherwise) display the login page.
     */
    const login = () => maybe(!keycloak.authenticated)(() => keycloak.login())

    const register = () => keycloak.register();

    const logout = () => {
        maybe(keycloak.authenticated)(() => keycloak.logout())
        setValueOf(loggedIn)(false);
        keycloak.clearToken();
    }

    return Object.freeze({
        login,
        logout,
        isLoggedIn,
        register,
        init,
        loggedIn: () => loggedIn,
    })
}

const AuthController = authController();
