import {dom} from "../util/dom.js";
import {appendFirst} from "../util/appendFirst.js";

export {mainNavProjector}

/**
 * @param rootElement
 * @param mainNavController
 * @param menuEntries
 */
const mainNavProjector = ({rootElement, mainNavController, menuEntries}) => {

    const navBarElement = dom(`
        <NAV class="mainnav"> <div class="menu-entries">` +

        menuEntries.map(entry => '<a>' + entry + '</a>').join('')

        + `</div>
          <a class="mainnav-avatar">
            <img alt="Avatar" class="avatar">
          </a>
          <a class="mainnav-user">mab9.test@gmail.com</a>
          <a href="javascript:void(0);" class="hamburger">
            <i class="fa fa-bars"></i>
          </a>
        </NAV>`);

    const entries = navBarElement.querySelector('.menu-entries');
    const avatar = navBarElement.querySelector('.avatar');
    const hamburger = navBarElement.querySelector('.hamburger');

    const [home] = entries.children;
    home.classList.add('home');

    for (let entry of entries.children) {
        entry.onclick = () => mainNavController.setMainContentValue(entry.innerText)
    }

    avatar.src = './src/assets/img/avatars/svg/035-man-4.svg';

    hamburger.onclick = () => topNav.className === "mainnav"
        ? topNav.className += " responsive"
        : topNav.className = "mainnav";

    appendFirst(rootElement)(navBarElement);
};

