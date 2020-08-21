import {dom} from "../assets/util/dom.js";
import {appendFirst} from "../assets/util/appendFirst.js";

export {mainNavProjector}

/**
 * @param rootElement
 * @param mainNavController
 * @param menu
 */
const mainNavProjector = (rootElement, mainNavController, menu) => {

    const navBarElement = dom(`
        <NAV class="mainnav"> <div class="menu-entries">` +

        // use of the html5 data attribute to associate the unique menu id to an element
        menu.getEntries().map(entry => '<a data-menu-id="' + entry.id + '">' + entry.title + '</a>').join('')

        + `</div>
          <a class="mainnav-avatar">
            <img alt="Avatar" class="avatar">
          </a>
          <a class="mainnav-user">mab9.test@gmail.com</a>
          <a href="javascript:void(0);" class="hamburger">
            <i class="fa fa-bars"></i>
          </a>
        </NAV>`);

    const mainnav = navBarElement.querySelector('.mainnav');
    const entries = navBarElement.querySelector('.menu-entries');
    const avatar = navBarElement.querySelector('.avatar');
    const hamburger = navBarElement.querySelector('.hamburger');

    const [home] = entries.children;
    home.classList.add('home');

    for (let entry of entries.children) {
        entry.onclick = () => {
            menu.setSelectedEntry(entry.dataset.menuId)
        }
    }

    avatar.src = './src/assets/img/avatars/svg/035-man-4.svg';

    hamburger.onclick = () => mainnav.className === "mainnav"
        ? mainnav.className += " responsive"
        : mainnav.className = "mainnav";

    appendFirst(rootElement)(navBarElement);
};

