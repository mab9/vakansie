import {layoutProjector} from "./layoutProjector.js";

export {layoutController, LayoutView};

/**
 * @return LayoutController
 * @constructor
 */
const LayoutController = () => {

    /**
     * @typedef {Readonly<object>} LayoutController
     */
    return Object.freeze({})
};

/**
 * @param rootElement
 * @constructor
 */
const LayoutView = ({rootElement}) => {
    const render = () => {
        layoutProjector({rootElement});
    };

    render();
};

const layoutController = LayoutController();
