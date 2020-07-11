import {mainNavProjector} from "./mainNavProjector.js";

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
 * @param menu
 * @constructor
 */
const MainNavView = (rootElement, menu) => {
    const render = () => {
        mainNavProjector(rootElement, mainNavController, menu);
    };

    render();
};
