import {appendFirst} from "../util/appendFirst.js";
import {dom} from "../util/dom.js";

export {userController, UserView};

/**
 * @return Readonly {UserController}
 * @constructor
 */
const UserController = () => {

    /**
     * @typedef UserController
     */
    return Object.freeze({});
};
const userController = UserController();

/**
 * @param rootElement
 * @param mainNavController
 * @constructor
 */
const UserView = ({rootElement}) => {
    const render = () => {
        const user = dom(`user content`)
        appendFirst(rootElement)(user)
    };

    render();
};
