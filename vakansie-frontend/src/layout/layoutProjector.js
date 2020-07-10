import {MainNavView} from "../mainNav/mainNav.js";
import {appendFirst} from "../util/appendFirst.js";
import {dom} from "../util/dom.js";
import {menu} from "../mainNav/menu.js";
import {fst, snd} from "../assets/church/rock.js";

// views are used by the eval function
import {HomeView} from "../home/home.js";
import {UserView} from "../user/user.js";

// use of import to avoid import removal on "ctrl alt o" shortcut
const homeView = HomeView(null)
const userView = UserView(null)


export {layoutProjector};

/**
 * @param rootElement
 */
const layoutProjector = ({rootElement}) => {
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

    menu.onSelectedEntryChange(value => {
        //console.info('render view: ' + value(snd))
        //HomeView({rootElement: mainContent})
        eval(`${value(snd)}({rootElement: mainContent})`);
    })

    MainNavView({rootElement: mainNav});
    //SideNavView({rootElement: sideNav});
    appendFirst(rootElement)(layoutElement)
};
