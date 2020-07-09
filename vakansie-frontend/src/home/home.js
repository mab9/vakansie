import {appendFirst} from "../util/appendFirst.js";
import {dom} from "../util/dom.js";

export {homeController, HomeView};

/**
 * @return Readonly {HomeController}
 * @constructor
 */
const HomeController = () => {

    /**
     * @typedef HomeController
     */
    return Object.freeze({});
};
const homeController = HomeController();

/**
 * @param rootElement
 * @param mainNavController
 * @constructor
 */
const HomeView = ({rootElement}) => {
    const render = () => {
        const home = dom(`home content`)
        appendFirst(rootElement)(home)
    };

    render();
};
