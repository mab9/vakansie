
import { vakansieService } from "./service/localService.js";
import { start }  from "../starter.js";

const appRootId = window.appRootId;

vakansieService().loadPersons( devs => start(appRootId, devs) );


