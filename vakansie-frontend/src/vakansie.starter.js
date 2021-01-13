import {translationService} from "./service/translation.service.js";
import {start} from "../starter.js";
import {AuthController} from "./auth/auth.prod.js";

const appRootId = window.appRootId;


const render = authenticated => start(appRootId, authenticated);


// load languages
translationService.init();

const keycloak = AuthController.init();

keycloak.onReady = authenticated => render(authenticated);

keycloak.then(authenticated => {
    authenticated
        ? console.info("Client was authenticated")
        : console.info("Client is not authenticated");
    render(authenticated);
}).catch(() => {
    console.error("Could not initialize client for authentication")
});


AuthController.login();
