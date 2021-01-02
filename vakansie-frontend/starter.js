import {LayoutController, LayoutView} from "./src/layout/layout.js";
import {dom} from "./src/assets/util/dom.js";
import "./keycloak.js"

export {start} ;

const start = (appRootId, persons) => {

    const CONTENT_WRAPPER = 'root';
    const layoutController = LayoutController();

    // https://github.com/keycloak/keycloak-documentation/blob/master/securing_apps/topics/oidc/javascript-adapter.adoc
    const initKeyCloak = () => {
        const keycloak = new Keycloak("./keycloak.json");
        keycloak.init({
            onLoad: 'login-required' // login-required will authenticate the client if the user is logged-in to vakansie or display the login page if not.
        }).then(function (authenticated) {
            // After the user is authenticated the application can make
            // requests to RESTful services secured by vakansie by including the bearer token
            // in the Authorization header.
            console.info(authenticated ? 'authenticated' : 'not authenticated');
            // keycloak.token

            const jwtPayload = JSON.parse(atob(keycloak.token.split(".")[1]));
            const userIdKeycloak = jwtPayload.sub;
            const userName = jwtPayload.name;
            const userEmail = jwtPayload.email;
            render(authenticated);
        }).catch(function () {
            alert('failed to initialize');
        });
    }


    const render = loggedIn => {

        // todo: think about resetting the model world on a possible re-render

        const root = document.getElementById(CONTENT_WRAPPER)
        const vakansie = dom(`<div id="${appRootId}">`);

        if (loggedIn) {
            LayoutView(vakansie, layoutController);
            root.replaceWith(vakansie);
        } else {
            initKeyCloak();
        }
    }

    render(false);
}
