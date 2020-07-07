import {OVERVIEW_TAB, TAB_LS_KEY, USER_TAB} from "./tabs.js";
import {localStorageService} from "../services/localStorageService.js";
import {userProjector} from "./userTab/userProjector.js";
import {overviewProjector} from "./overviewTab/overivewProjector.js";

/**
 * @param rootElement
 */
const tabContentView = ({rootElement}) => {
    const render = ({tab}) => {
        switch (tab) {
            case OVERVIEW_TAB:
                overviewProjector({rootElement});
                localStorageService.toLocalStorage(TAB_LS_KEY, OVERVIEW_TAB);
                break;
            default:
                userProjector({rootElement});
                localStorageService.toLocalStorage(TAB_LS_KEY, USER_TAB);
                break;
        }
    };
};

export {tabContentView};
