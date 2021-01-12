import {translationService} from "./service/translation.service.js";
import {start} from "../starter.js";
import {AuthController} from "./auth/auth.js";

const appRootId = window.appRootId;


const render = () => {
// vakansieService().loadPersons( devs => start(appRootId, devs) );
    start(appRootId);
}


// load languages
translationService.init();

const keycloak = AuthController.init();

keycloak.onReady = authenticated => render();

keycloak.then(authenticated => {
    authenticated
        ? console.info("Client was authenticated")
        : console.info("Client is not authenticated");
    render();
}).catch(() => {
    console.error("Could not initialize client for authentication")
});

