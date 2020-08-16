import {dom} from "../util/dom.js";
import {Menu} from "../menu/menu.js";
import {MainNavView} from "../mainNav/mainNav.js";
import {appendFirst} from "../util/appendFirst.js";

import {HomeController, HomeView} from "../modules/home/home.js";
import {PersonController, PersonView} from "../modules/person/person.js";

// use of imports to avoid import removal on "ctrl alt o" shortcut
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

    const controllers = new Map();

    const getController = controller => controllers.has(controller)
        ? controllers.get(controller)
        : controllers.set(controller, eval(`${controller}()`)).get(controller); // lazy init

    /**
     * @typedef {Readonly<object>} LayoutController
     */
    return Object.freeze({
        getController : getController,
    })
}

/**
 * @param rootElement
 * @constructor
 */
const LayoutView = (rootElement, layoutController) => {
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

        // todo handle listener clean up when the view changes
        menu.onSelectedEntryChange(entry => {
            const gotoView = entry.view;
            const gotoController = entry.ctrl;
            // is used by the eval function
            const viewController = layoutController.getController(gotoController);
            // todo replace eval with instances that are managed dynamically
            eval(`${gotoView}(mainContent, viewController)`);
        })

        MainNavView(mainNav, menu);
        appendFirst(rootElement)(layoutElement)
    };

    render();
};
