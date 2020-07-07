import {mainContentProjector} from "./mainContentProjector.js";

/**
 * @return MainContentController
 * @constructor
 */
const MainContentController = () => {

    /**
     * @typedef {Readonly<object>} MainContentController
     */
    return Object.freeze({})
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
