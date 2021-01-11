import {translationService} from "./service/translation.service.js";
import {start} from "../starter.js";
import {AuthController} from "./auth/auth.js";

const appRootId = window.appRootId;


AuthController.init();

// load languages
translationService.init();
// vakansieService().loadPersons( devs => start(appRootId, devs) );
start(appRootId, null);
