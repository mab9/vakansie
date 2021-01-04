import {translationService} from "./service/translation.service.js";
import {start} from "../starter.js";

const appRootId = window.appRootId;


// load languages
translationService.init();
// vakansieService().loadPersons( devs => start(appRootId, devs) );
start(appRootId, null);
