import "../../keycloak.js"
import {Attribute, setValueOf} from "../base/presentationModel/presentationModel.js";

export {authLocalController}

/**
 * @typedef AuthLocalController
 * @property {Function} login
 * @property {Function} logout
 *
 * Mock of authController to avoid running keycloak for frontend dev.
 */
const authLocalController = () => {

    const loggedIn = Attribute(false);

    const keycloak = {
        onReady: undefined,
        then: () => new Promise(() => undefined),  // don't handle it, not used at the moment
        catch: () => undefined,  // don't handle it, not used at the moment
    }

    const init = () => {
        setTimeout(() => keycloak.onReady(false), 500);
        return keycloak;
    }

    const loadUserProfile = () => {
        const profile = {email: "mab9.test@gmail.com"};
        return new Promise(res => res(profile))
    }

    const login = () => {
        setValueOf(loggedIn)(true);
        keycloak.onReady(true);
    }

    const register = () => alert("Not implemented for local development");

    const logout = () => setValueOf(loggedIn)(false);


    return Object.freeze({
        login: login,
        logout: logout,
        isLoggedIn: () => keycloak.authenticated,
        register: register,
        init: init,
        loadUserProfile: () => loadUserProfile(),  // return fake profile
    })
}




