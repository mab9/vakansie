import {Observable}         from "../assets/observable/observable.js";
import {mainNavProjector}   from "./mainNavProjector.js";

/**
 * @return Readonly {MainNavController}
 * @constructor
 */
const MainNavController = () => {
    const buttonClicked = Observable(false);

    /**
     * @typedef MainNavController
     * @type {object}
     * @property {function} setButtonClickedValue.
     * @property {function} getButtonClickedValue.
     * @property {function} onButtonClicked.
     */
    return Object.freeze({
        setButtonClickedValue   : buttonClicked.setValue,
        getButtonClickedValue   : buttonClicked.getValue,
        onButtonClicked         : buttonClicked.onChange,
    });
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
