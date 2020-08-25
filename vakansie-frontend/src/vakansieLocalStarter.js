
import { vakansieService } from "./service/localService.js";
import {translationService} from "./service/translationService.js";
import { start }  from "../starter.js";

const appRootId = window.appRootId;


// load languages
translationService.init();
vakansieService().loadPersons( devs => start(appRootId, devs) );


