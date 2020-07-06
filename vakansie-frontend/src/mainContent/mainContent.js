import {mainContentProjector} from "./mainContentProjector.js";
import {Observable} from "../assets/observable/observable.js";
import {TAB_LS_KEY} from "./tabs.js";
import {localStorageService} from "../services/localStorageService.js";



/**
 * @return MainContentController
 * @constructor
 */
const MainContentController = () => {
    /** @type Observable */
    const selectedTab = Observable(localStorageService.fromLocalStorage(TAB_LS_KEY));

    /**
     * @typedef {Readonly<object>} MainContentController
     * @property {function} setSelectedTabValue
     * @property {function} getSelectedTabValue
     * @property {function} onSelectedTabChange
     * @property {function} onContextDataLoaded
     */
    return Object.freeze({
        onSelectedTabChange: selectedTab.onChange,
        setSelectedTabValue: selectedTab.setValue,
        getSelectedTabValue: selectedTab.getValue,
    })
};

/**
 * @param rootElement
 * @constructor
 */
const MainContentView = ({rootElement}) => {
    const render = () => {
        mainContentProjector({rootElement});
    };

    render();
};

const mainContentController = MainContentController();

export {mainContentController, MainContentView};
