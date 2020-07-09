import {mainNavProjector} from "./mainNavProjector.js";
import {menu} from "./menu.js";

export {mainNavController, MainNavView};

/**
 * @return Readonly {MainNavController}
 * @constructor
 */
const MainNavController = () => {

    /**
     * @typedef MainNavController
     */
    return Object.freeze({});
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
