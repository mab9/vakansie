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
