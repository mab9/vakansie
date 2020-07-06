import {Observable}         from "../assets/observable/observable.js";
import {sideNavProjector}   from "./sideNavProjector.js";

/**
 * @return {SideNavController}
 * @constructor
 */
const SideNavController = () => {
    const isVisible = Observable(true);

    /**
     * @typedef SideNavController
     * @type {Readonly<object>}
     * @property {function} setVisibility.
     * @property {function} getVisibility.
     * @property {function} onVisibilityChange.
     */
    return Object.freeze({
        setVisibility       : isVisible.setValue,
        getVisibility       : isVisible.getValue,
        onVisibilityChange  : isVisible.onChange,
    });
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
