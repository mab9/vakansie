import {mainNavProjector} from "./mainNavProjector.js";
import {Observable} from "../assets/observable/observable.js";
import {menu} from "./menu.js";

export {mainNavController, MainNavView};

const menuEntries = ['Vakansie', 'Planner', 'About']

/**
 * @return Readonly {MainNavController}
 * @constructor
 */
const MainNavController = () => {

    const visibleMainContent = Observable('default-page');

    /**
     * @typedef MainNavController
     * @property {function} setMainContentValue
     * @property {function} getMainContentValue
     * @property {function} onMainContentChange
     */
    return Object.freeze({
        onMainContentChange: visibleMainContent.onChange,
        getMainContentValue: visibleMainContent.getValue,
        setMainContentValue: visibleMainContent.setValue,
    });
};
const mainNavController = MainNavController();

/**
 * @param rootElement
 * @param mainNavController
 * @constructor
 */
const MainNavView = ({rootElement}) => {
    const render = () => {
        mainNavProjector({rootElement, mainNavController, menu});
    };

    render();
};
