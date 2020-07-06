import {sideNavController} from "./sideNav.js";
import {mainNavController} from "../mainNav/mainNav.js";
import {appendFirst} from "../services/appendFirstService.js";

const sideNavProjector = ({rootElement}) => {
    /* Open and closes side nav */
    mainNavController.onButtonClicked(() => {
        sideNavController.setVisibility(!sideNavController.getVisibility());
        sideNavController.getVisibility() ?
            rootElement.classList.add("side-nav-closed") :
            rootElement.classList.remove("side-nav-closed");
    });

    const renderSideNav = () => {
        const template = document.createElement("DIV");
        appendFirst(rootElement)(template)
    };

    renderSideNav();
};

export {sideNavProjector}
