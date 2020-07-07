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
          <a href="#avatar" class="mainnav-avatar">
            <img alt="Avatar" class="avatar">
          </a>
          <a href="#user" class="mainnav-user">mab9.test@gmail.com</a>
          <a href="javascript:void(0);" class="icon">
            <i class="fa fa-bars"></i>
          </a>
        </NAV>`);

    const topNav = navBarElement.querySelector('.mainnav');
    const menuIcon = navBarElement.querySelector('.icon');
    const avatarIcon = navBarElement.querySelector('.avatar');

    avatarIcon.src = './src/assets/img/avatars/svg/035-man-4.svg';

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

