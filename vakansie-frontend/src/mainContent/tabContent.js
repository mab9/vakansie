import {DEFAULT_TAB, USER_TAB, OVERVIEW_TAB, TAB_LS_KEY} from "./tabs.js";
import {mainContentController} from "./mainContent.js";
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

    mainContentController.onSelectedTabChange(
        /**
         * @param {string} newVal
         * @param {string} oldVal
         */
        (newVal, oldVal) => {
            if (newVal !== oldVal) {
                rootElement.innerHTML = '';
                render({tab: newVal});
            }
        });

    if (!localStorageService.keyExistsInLocalStorage(TAB_LS_KEY)) {
        mainContentController.setSelectedTabValue(TAB_LS_KEY, DEFAULT_TAB);
    } else {
        render({tab: localStorageService.fromLocalStorage(TAB_LS_KEY)});
    }
};

export {tabContentView};
