import {LayoutController, LayoutView} from "./src/layout/layout.js";
import {dom} from "./src/assets/util/dom.js";
import {AuthController} from "./src/auth/auth.js";

export {start} ;

const start = (appRootId, persons) => {

    const CONTENT_WRAPPER = 'root';
    const layoutController = LayoutController();

    const login = () => {

        // https://github.com/keycloak/keycloak-documentation/blob/master/securing_apps/topics/oidc/javascript-adapter.adoc
        AuthController.login().then(authenticated => {
            // After the user is authenticated the application can make
            // requests to RESTful services secured by vakansie by including the bearer token
            // in the Authorization header.
            console.info(authenticated ? 'authenticated' : 'not authenticated');
            // keycloak.token
            render(authenticated);
        }).catch(event => {
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
            login();
        }
    }

    render(false);
}
