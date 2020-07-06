import {mainContentController} from './mainContent.js'

export const USER_TAB = 'USER_TAB';
export const OVERVIEW_TAB = 'OVERVIEW_TAB';
export const DEFAULT_TAB = USER_TAB;
export const TAB_LS_KEY = 'TAB_LS_KEY';

/**
 * @param rootElement
 */
const tabsView = ({rootElement}) => {
    const render = () => {
        tabsProjector({rootElement});
    };

    render();
};

/**
 * @param rootElement
 */
const tabsProjector = ({rootElement}) => {
    const setActive = (tab) => tab.classList.add('active');
    const removeActive = (tab) => tab.classList.remove('active');

    const template = document.createElement("DIV");
    template.innerHTML = `
    <A class="tab" id="user-tab selected">User</A>
    <A class="tab" id="overview-tab">Overview</A>`;

    const [userTab, overviewTab] = template.children;

    userTab.onclick = () => {
        mainContentController.setSelectedTabValue(USER_TAB);
        setActive(userTab);
        removeActive(overviewTab);
    };
    overviewTab.onclick = () => {
        mainContentController.setSelectedTabValue(OVERVIEW_TAB);
        setActive(overviewTab);
        removeActive(userTab);
    };

    setActive(!mainContentController.getSelectedTabValue()
        ? userTab
        : mainContentController.getSelectedTabValue() === USER_TAB
            ? userTab
            : overviewTab);
    rootElement.appendChild(userTab);
    rootElement.appendChild(overviewTab);
};

export {tabsView, tabsProjector};
