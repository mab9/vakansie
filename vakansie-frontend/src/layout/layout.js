import {dom} from "../util/dom.js";
import {Menu} from "../mainNav/menu.js";
import {MainNavView} from "../mainNav/mainNav.js";
import {appendFirst} from "../util/appendFirst.js";
import {fst, snd} from "../assets/church/rock.js";

import {HomeView} from "../modules/home/home.js";
import {PersonView} from "../modules/person/person.js";

// use of import to avoid import removal on "ctrl alt o" shortcut
const homeView = HomeView;
const personView = PersonView;

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

        // todo clean up listener when the view changes
        menu.onSelectedEntryChange(value => {
            //console.info('render view: ' + value(snd))
            //HomeView({rootElement: mainContent})
            //mainContent.textContent = '';
            eval(`${value(snd)}({rootElement: mainContent})`);
        })

        MainNavView(mainNav, menu);
        appendFirst(rootElement)(layoutElement)
    };

    render();
};

