import {mainNavProjector, pageCss} from "./mainNavProjector.js";
import {appendsStyle} from "../assets/util/appends.js";

export {mainNavController, MainNavView};

appendsStyle(pageCss);

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
