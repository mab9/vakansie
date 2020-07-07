import {MainNavView} from "../mainNav/mainNav.js";
import {appendFirst} from "../util/appendFirst.js";
import {dom} from "../util/dom.js";

export {layoutProjector};

/**
 * @param {SideNavController} sideNavController
 * @param rootElement
 */
const bindSideNav = ({sideNavController, rootElement}) => {
    /*  sideNavController.onVisibilityChange((newVal, oldVal) => {
          if (newVal !== oldVal) {
              if (sideNavController.getVisibility()) rootElement.classList.remove("main-content-margin-right");
              else rootElement.classList.add("main-content-margin-right");
          }
      }) */
};

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
    //const sideNav = template.querySelector('#side-nav');

    MainNavView({rootElement: mainNav});
    //SideNavView({rootElement: sideNav});
    appendFirst(rootElement)(layoutElement)
};
