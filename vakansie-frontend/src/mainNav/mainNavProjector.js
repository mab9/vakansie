import {dom} from "../assets/util/dom.js";
import {appendFirst} from "../assets/util/appends.js";
import {translationService} from "../service/translation.service.js";
import {AuthController} from "../auth/auth.prod.js";

export {mainNavProjector, pageCss}

const masterClassName = 'nav-main-view'; // should be unique for this projector

/**
 * @param rootElement
 * @param mainNavController
 * @param menu
 */
const mainNavProjector = (rootElement, mainNavController, menu) => {

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
           <!-- Modal content -->
           <div class="${masterClassName}-modal">
                 <div class="${masterClassName}-modal-header">
                   <h2>Firstname Lastname</h2>
                   <p>email</p>
                   <p>Manage your Vakansie Account</p>
                 </div>
                 <div class="${masterClassName}-modal-body">
                   <p>Sign out</p>
                 </div>
                 <div class="${masterClassName}-modal-footer">
                   <p>Terms of Service</p>
                 </div>
           </div>

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


    // modal stufff - to provide a google modal like feeling.
    const btn = navBarElement.querySelector(`.${masterClassName}-myBtn`);
    const modal = navBarElement.querySelector(`.${masterClassName}-modal`);


    // When the user clicks on the button, open the modal
    btn.onclick = () => modal.style.display = "block";

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = event => {
        if (event.target == btn) return // guard
        if (!modal.contains(event.target)) {
            modal.style.display = "none";
        }
    }


    //appendFirst(document.body)(modalElement);
    appendFirst(rootElement)(navBarElement);
};

const pageCss = `

    .${masterClassName}-modal {
        display: none; /* Hidden by default */
        position: fixed; /* Stay in place */
        z-index: 1; /* Sit on top */
        right: 16px;
        top: 50px;
        width: 355px; /* Full width */
        height: 405px; /* Full height */
        overflow: auto; /* Enable scroll if needed */
        padding: 10px;

        background: #fff;
        border-radius: 8px;
        border: 1px solid #ccc;
        border-color: rgba(0,0,0,.2);

        -webkit-animation: fadeIn .2s;
        animation: fadeIn .2s;

        box-shadow: 0 2px 10px rgba(0,0,0,.2);
    }

    @-webkit-keyframes fadeIn {
    from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes fadeIn {
        from { opacity: 0; }
          to { opacity: 1; }
    }


    .${masterClassName}-modal-header {
      padding: 2px 16px;
      background-color: #5cb85c;
      color: white;
    }

    .${masterClassName}-modal-body {padding: 2px 16px;}

    .${masterClassName}-modal-footer {
      padding: 2px 16px;
      background-color: #5cb85c;
      color: white;
    }
`;
