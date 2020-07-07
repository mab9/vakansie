import {sideNavProjector} from "./sideNavProjector.js";

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

export {sideNavController, SideNavView};
