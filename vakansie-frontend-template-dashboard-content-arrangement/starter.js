import {dom} from "../vakansie-frontend/src/assets/util/dom.js";
import {mainProjector} from "./src/main.js";


const render = () => {

    const layoutElement = dom(`
            <div id="mobile-navigation" class="mobile-navigation">
                
                 <div class="mobile-navigation--header">
                    <!-- <img src="./logo.png" alt="" class="logo" />-->
                    <a class="mobile-navigation--header-home-logo"><i class="fa fa-globe-africa"></i>Vakansie</a>
                    <div class="close-button"><button><i class="fa fa-close"></i></button></div>
                </div>
            
            
                <a href="" class="mobile-navigation--item mobile-navigation--item__active">Home</a> 
                <a href="" class="mobile-navigation--item">Features</a> 
                <a href="" class="mobile-navigation--item">Pricing</a> 
                <a href="" class="mobile-navigation--item">Login</a> 
                <a href="" class="mobile-navigation--item">Join Team</a> 
            </div>

            <div id="container" class="collapse__open">
                <div class="header">
                    <!-- <img src="./logo.png" alt="" class="logo" />-->
                    <a class="home-logo"><i class="fa fa-globe-africa"></i>Vakansie</a>
                </div>
                <div class="navigation">
                    <nav>
                        <a class="navigation--item-home-logo"><i class="fa fa-globe-africa"></i>Vakansie</a>
                        <a class="navigation--item navigation--item__active"><i class="fas fa-home"></i>Home</a> 
                        <a class="navigation--item"><i class="fas fa-calendar-alt"></i>Calendar</a> 
                        <a class="navigation--item"><i class="fas fa-users"></i>Employees</a> 
                        <a class="navigation--item"><i class="fas fa-thumbs-up"></i>Events to approve</a> 
                        <a class="navigation--item"><i class="fas fa-user"></i>My account</a> 
                        <a class="navigation--item"><i class="fas fa-search"></i>Search events</a> 
                        <a id="navigation--item--collaps" class="navigation--item"><i class="fas fa-angle-double-up fa-rotate-270"></i>Collapse menu</a> 
                    </nav>
                    <div class="menu-button"><button><i class="fa fa-reorder"></i></button></div>
                    <button class="navigation--button">Register</button>
                </div>
                <div class="main">
                    <div class="main--content"></div>
                </div>
            </div>
        `);

    const [mobileNav, container] = layoutElement.children;
    const [header, navigation, main] = container.children;


    const closeBtn = layoutElement.querySelector(".close-button");
    const menuBtn = layoutElement.querySelector(".menu-button");
    const collapseBtn = layoutElement.querySelector("#navigation--item--collaps");

    closeBtn.onclick = () => toggleMobileNavigation();
    menuBtn.onclick = () => toggleMobileNavigation();
    collapseBtn.onclick = () => toggleSideMenu();

    const toggleMobileNavigation = () => {
        const element = document.querySelector("#mobile-navigation")
        const clazz = "mobile-navigation__open";
        element.classList.contains(clazz)
            ? element.classList.remove(clazz)
            : element.classList.add(clazz);
    }

    const toggleSideMenu = () => {
        const container = document.querySelector("#container")
        const collapsIcon = document.querySelector("#navigation--item--collaps > i")

        if (container.classList.contains("collapse__open")) {
            container.classList.remove("collapse__open");
            container.classList.add("collapse__close")

            collapsIcon.classList.add("fa-rotate-90")
            collapsIcon.classList.remove("fa-rotate-270")
        } else {
            container.classList.remove("collapse__close");
            container.classList.add("collapse__open");

            collapsIcon.classList.remove("fa-rotate-90")
            collapsIcon.classList.add("fa-rotate-270")
        }
    }

    mainProjector(main.children[0]);

    document.querySelector("#root").replaceWith(layoutElement);
};


render();
