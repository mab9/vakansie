import "../../keycloak.js"
import {maybe} from "../assets/util/maybe.js";
import {authLocalController} from "./auth.local.js"
import {config} from "../../config.js";


export {AuthController}

/**
 * @typedef AuthController
 * @property {Function} login
 * @property {Function} logout
 */
const authController = () => {

    // https://github.com/ahus1/keycloak-dropwizard-integration/blob/master/keycloak-dropwizard-bearer/src/main/resources/assets/ajax/app.js
    const keycloak = new Keycloak("./keycloak.json");
    const init = () => keycloak.init({onLoad: 'check-sso'}); // check-sso does not enforce an auth step.

    // some examples that may be used
    // keycloak.onAuthSuccess =  // show privileged page //
    // keycloak.onAuthError = // show welcome page
    // keycloak.onAuthRefreshSuccess =
    // keycloak.onAuthRefreshError =  // show page x / login?

    const login = () => maybe(!keycloak.authenticated)(() => keycloak.login())

    const register = () => keycloak.register();

    const logout = () => {
        maybe(keycloak.authenticated)(() => keycloak.logout())
        keycloak.clearToken();
    }

    return Object.freeze({
        login: login,
        logout: logout,
        isLoggedIn: () => keycloak.authenticated,
        register: register,
        init: init,
        loadUserProfile: () => keycloak.loadUserProfile(),
    })
}

let AuthController;

if (config.environment === 'local') {
    AuthController = authLocalController();
} else {
    AuthController = authController();
}







