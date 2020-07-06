import {mainNavController} from "./mainNav.js";
import {sideNavController} from "../sideNav/sideNav.js";

const insetProjector = () => {
    const template = document.createElement("DIV"); // only for parsing
    template.innerHTML = `
    <DIV class="main-nav-left"></DIV>
    <DIV class="main-nav-center noselect"></DIV>
    <DIV class="main-nav-right"></DIV>`;

    return template.children;
};

const menuBurgerProjector = () => {
    const template = document.createElement("DIV"); // only for parsing
    template.innerHTML = `
    <DIV class="main-nav-burger">
        <SPAN>
            <SPAN></SPAN>
            <SPAN></SPAN>
            <SPAN></SPAN>
        </SPAN>
    </DIV>`;

    const [menuBurger] = template.children;

    menuBurger.onclick = () => mainNavController.setButtonClickedValue(!mainNavController.getButtonClickedValue());
    sideNavController.onVisibilityChange(
        /**
         * @param {boolean} newVal
         * @param {boolean} oldVal
         */
        (newVal, oldVal) => {
            if (newVal !== oldVal) {
                newVal ?
                    menuBurger.classList.add('side-nav-closed') :
                    menuBurger.classList.remove('side-nav-closed');
            }
        }
    );

    return menuBurger;
};

/**
 * @param rootElement
 */
const mainNavProjector = ({rootElement}) => {
    const menuBurger = menuBurgerProjector();
    const [left, center, right] = insetProjector();

    right.appendChild(menuBurger);

    rootElement.appendChild(left);
    rootElement.appendChild(center);
    rootElement.appendChild(right);
};

export {mainNavProjector}
