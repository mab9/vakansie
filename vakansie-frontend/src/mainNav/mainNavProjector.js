import {dom} from "../util/dom.js";
import {appendFirst} from "../util/appendFirst.js";

export {mainNavProjector}

/**
 * @param rootElement
 */
const mainNavProjector = ({rootElement}) => {

    const navBarElement = dom(`
        <NAV class="mainnav">
          <a href="#home" class="active">Vakansie</a>
          <a href="#planner">Planner</a>
          <a href="#about">About</a>
          <a href="javascript:void(0);" class="icon">
            <i class="fa fa-bars"></i>
          </a>
        </NAV>`);

    const topNav = navBarElement.querySelector('.mainnav');
    const menuIcon = navBarElement.querySelector('.icon');

    const toggleResponsivenes = () => {
        if (topNav.className === "mainnav") {
            topNav.className += " responsive";
        } else {
            topNav.className = "mainnav";
        }
    }

    menuIcon.onclick = () => toggleResponsivenes();
    appendFirst(rootElement)(navBarElement);
};

