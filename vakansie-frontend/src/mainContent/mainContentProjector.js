import {tabsView} from "./tabs.js";
import {tabContentView} from "./tabContent.js";
import {sideNavController, SideNavView} from "../sideNav/sideNav.js";
import {MainNavView} from "../mainNav/mainNav.js";

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
const mainContentProjector = ({rootElement}) => {
    const template = document.createElement("DIV");
    template.id = 'content-wrapper';

    template.innerHTML = `
    <NAV id="main-nav"></NAV>
    <DIV id="content">
        <DIV id="main-content" class="main-content-margin-right">
            <DIV id="tabs" class="tabs"></DIV>
            <DIV id="tab-content" class="tab-content"></DIV>
        </DIV>
        <NAV id="side-nav"></NAV>
    </DIV>`;

    const mainContent = template.querySelector('#main-content');
    const mainNav = template.querySelector('#main-nav');
    const sideNav = template.querySelector('#side-nav');
    const tabs = template.querySelector('#tabs');
    const tabContent = template.querySelector('#tab-content');

    MainNavView({rootElement: mainNav});
    SideNavView({rootElement: sideNav});
    tabsView({rootElement: tabs});
    tabContentView({rootElement: tabContent});

    bindSideNav({sideNavController, rootElement: mainContent});

    rootElement.replaceWith(template);
};

export {mainContentProjector};
