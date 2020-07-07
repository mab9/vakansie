import {sideNavProjector} from "./sideNavProjector.js";

export {sideNavController, SideNavView};

/**
 * @return {SideNavController}
 * @constructor
 */
const SideNavController = () => {
    /**
     * @typedef SideNavController
     * @type {Readonly<object>}
     */
    return Object.freeze({});
};

/**
 * @param rootElement
 * @constructor
 */
const SideNavView = ({rootElement}) => {
    const render = () => {
        sideNavProjector({rootElement});
    };

    render();
};

const sideNavController = SideNavController();

