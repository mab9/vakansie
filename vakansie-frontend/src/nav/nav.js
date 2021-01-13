import {modalProjector, pageCss} from "./modal.projector.js";
import {appendFirst, appendsStyle} from "../assets/util/appends.js";
import {dom} from "../assets/util/dom.js";
import {AuthController} from "../auth/auth.prod.js";
import {translationService} from "../service/translation.service.js";
import {Attribute, setValueOf} from "../base/presentationModel/presentationModel.js";

export {MainNavView};

appendsStyle(pageCss);

const masterClassName = 'nav-main-view'; // should be unique for this projector


/**
 * @param rootElement
 * @param menu
 * @constructor
 */
const MainNavView = (rootElement, menu) => {

    const navBarElement = dom(`
        <NAV class="mainnav"> <div class="menu-entries">` +

        // use of the html5 data attribute to associate the unique menu id to an element
        menu.getEntries().map(entry => '<a data-menu-id="' + entry.id + '" data-i18n="' + entry.title + '"></a>').join('')

        + `</div>
          <a class="mainnav-avatar">
            <img alt="Avatar" class="avatar">
          </a>
          <a class="mainnav-user">mab9@vakansie.com</a>
          <a class="mainnav-language">DE</a>

          <button class="${masterClassName}-myBtn">Open Modal</button>
          <div id="modal"></div>

          <a href="javascript:void(0);" class="hamburger">
            <i class="fa fa-bars"></i>
          </a>
        </NAV>`);

    const mainnav = navBarElement.querySelector('.mainnav');
    const entries = navBarElement.querySelector('.menu-entries');
    const avatar = navBarElement.querySelector('.avatar');
    const hamburger = navBarElement.querySelector('.hamburger');
    const language = navBarElement.querySelector('.mainnav-language');
    const user = navBarElement.querySelector('.mainnav-user');
    const modal = navBarElement.querySelector('#modal');


    const userDetails = AuthController.getUserDetails();
    user.innerHTML = userDetails.email;

    // todo make language management generic
    language.onclick = () => {
        if (translationService.currentLang.getValue() === 'de') {
            translationService.currentLang.setValue('en')
        } else {
            translationService.currentLang.setValue('de')
        }
    }

    translationService.currentLang.onChange(newLang => {
        language.innerHTML = newLang;
    })

    const [home] = entries.children;
    home.classList.add('home');

    for (let entry of entries.children) {
        entry.onclick = () => {
            menu.setSelectedEntry(entry.dataset.menuId)
        }
    }

    avatar.src = './src/assets/img/avatars/svg/035-man-4.svg';

    avatar.onclick = () => AuthController.logout();

    hamburger.onclick = () => mainnav.className === "mainnav"
        ? mainnav.className += " responsive"
        : mainnav.className = "mainnav";


    // Modal stuff
    const modalBtn = navBarElement.querySelector(`.${masterClassName}-myBtn`);
    const showModalAttr = Attribute(false);
    // When the user clicks on the button, open the modal
    modalBtn.onclick = () => setValueOf(showModalAttr)(true);
    modalProjector(modal, AuthController, showModalAttr, modalBtn);


    appendFirst(rootElement)(navBarElement);
};

