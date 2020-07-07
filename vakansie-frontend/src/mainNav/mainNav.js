import {mainNavProjector} from "./mainNavProjector.js";

/**
 * @return Readonly {MainNavController}
 * @constructor
 */
const MainNavController = () => {

    /**
     * @typedef MainNavController
     * @type {object}
     */
    return Object.freeze({});
};

/**
 * @param rootElement
 * @constructor
 */
const MainNavView = ({rootElement}) => {
    const render = () => {
        mainNavProjector({rootElement});
    };

    render();
};

const mainNavController = MainNavController();

export {mainNavController, MainNavView};
