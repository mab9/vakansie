import {dom} from "../assets/util/dom.js";
import {appendFirst} from "../assets/util/appends.js";

export {LandingView};

/**
 * @param rootElement
 * @constructor
 */
const LandingView = (rootElement) => {

    const render = () => {
        const containerElement = dom(`
            <DIV id="mainnav-section"></DIV>
            <DIV id="content-section">
                <DIV id="main-content" class="main-content">
                    <a>signin</a>
                    <a>signup</a>
                    <a>join group</a>
                </DIV>
            </DIV>`);

        const mainContent = containerElement.querySelector('#mainnav-section');

        appendFirst(rootElement)(containerElement)
    };


    // show welcom stuff
    // show btns for login, signup, join group
    // on auth action, invoke authCtrl. keycloak will redirect by himself if
    // auth was successful to the starter.js view.

    render();
};
