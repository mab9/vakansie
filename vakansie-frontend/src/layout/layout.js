import {dom} from "../util/dom.js";
import {Menu} from "../mainNav/menu.js";
import {MainNavView} from "../mainNav/mainNav.js";
import {appendFirst} from "../util/appendFirst.js";
import {label, view, controller} from "../mainNav/menu.js";

import {HomeController, HomeView} from "../modules/home/home.js";
import {PersonController, PersonView} from "../modules/person/person.js";

// use of import to avoid import removal on "ctrl alt o" shortcut
const homeView = HomeView;
const homeController = HomeController;
const personView = PersonView;
const personController = PersonController;

export {LayoutController, LayoutView};

/**
 * @return LayoutController
 * @constructor
 */
const LayoutController = () => {

    /**
     * @typedef {Readonly<object>} LayoutController
     */
    return Object.freeze({})
}

/**
 * @param rootElement
 * @constructor
 */
const LayoutView = ({rootElement}) => {
    const render = () => {
        const layoutElement = dom(`
        <DIV id="mainnav-section"></DIV>
        <DIV id="content-section">
            <DIV id="main-content" class="main-content">
                I'm in the main content (overwritten by the default menu selection)
            </DIV>
            <!-- <NAV id="side-nav"></NAV> -->
        </DIV>`);

        const mainNav = layoutElement.querySelector('#mainnav-section');
        // is used by the eval function
        const mainContent = layoutElement.querySelector('#main-content');

        const menu = Menu();
        const first = 0;

        // todo clean up listener when the view changes
        menu.onSelectedEntryChange(entry => {
            //mainContent.textContent = '';
            const gotoView = entry(view);
            const gotoController = entry(controller);
            eval(`${gotoView}(mainContent, ${gotoController})`);
        })

        MainNavView(mainNav, menu);
        appendFirst(rootElement)(layoutElement)
    };

    render();
};

