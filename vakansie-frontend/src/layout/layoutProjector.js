import {MainNavView} from "../mainNav/mainNav.js";
import {mainNavController} from "../mainNav/mainNav.js";
import {appendFirst} from "../util/appendFirst.js";
import {dom} from "../util/dom.js";
import {menu} from "../mainNav/menu.js";
import {fst, snd} from "../assets/church/rock.js";

export {layoutProjector};

/**
 * @param rootElement
 */
const layoutProjector = ({rootElement}) => {
    const layoutElement = dom(`
    <DIV id="mainnav-section"></DIV>
    <DIV id="content-section">
        <DIV id="main-content" class="main-content">
            I'm in the main content
        </DIV>
        <!-- <NAV id="side-nav"></NAV> -->
    </DIV>`);

    const mainNav = layoutElement.querySelector('#mainnav-section');
    const mainContent = layoutElement.querySelector('#main-content');
    //const sideNav = template.querySelector('#side-nav');

    menu.onSelectedEntryChange(value => console.info('render view: ' + value(snd)))
    MainNavView({rootElement: mainNav});
    //SideNavView({rootElement: sideNav});
    appendFirst(rootElement)(layoutElement)
};
