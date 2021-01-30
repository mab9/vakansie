import {dom} from "../vakansie-frontend/src/assets/util/dom.js";


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

            <div id="container">
                <div class="header">
                    <!-- <img src="./logo.png" alt="" class="logo" />-->
                    <a class="home-logo"><i class="fa fa-globe-africa"></i>Vakansie</a>
                </div>
                <div class="navigation">
                    <nav>
                        <a href="" class="navigation--item navigation--item__active">Home</a> 
                        <a href="" class="navigation--item">Features</a> 
                        <a href="" class="navigation--item">Pricing</a> 
                        <a href="" class="navigation--item">Login</a> 
                        <a href="" class="navigation--item">Join Team</a> 
                    </nav>
                    <div class="menu-button" onclick="${() => toggleMobileNavigation()}"><button><i class="fa fa-reorder"></i></button></div>
                    <button class="navigation--button">Register</button>
                </div>
                <div class="main">
                    <div class="main--content">
                        <h1 class="headline">Vacation platform </br> to book and track your time off</h1>
                        <p class="description">We do all our best to keep your agenda clean and up to date.</p>
                        <button class="play-button">
                            <i class="fa fa-play-circle"></i>Discover Video
                        </button>
                    </div>
                    <div class="main--img">
                        <img src="vacation.png" alt="vacations">
                    </div>
                </div>
                <div class="sidebar"></div>
                <div class="ads"></div>
                <div class="footer">
                    <div class="socials">
                        <a href="" class="socials--item"><i class="fa fa-github"></i></a>
                        <a href="" class="socials--item"><i class="fa fa-instagram"></i></a>
                        <a href="" class="socials--item"><i class="fa fa-twitter"></i></a>
                        <a href="" class="socials--item"><i class="fa fa-linkedin"></i></a>
                    </div>
                    <span>marc-antoine</span>
                </div>
            </div>
        `);

    const [header, navigation, main, sidebar, ads, footer] = layoutElement.children;


    const closeBtn = layoutElement.querySelector(".close-button");
    const menuBtn = layoutElement.querySelector(".menu-button");

    closeBtn.onclick = () => toggleMobileNavigation();
    menuBtn.onclick = () => toggleMobileNavigation();

    const toggleMobileNavigation = () => {
        const element = document.querySelector("#mobile-navigation")
        const clazz = "mobile-navigation__open";
        element.classList.contains(clazz)
            ? element.classList.remove(clazz)
            : element.classList.add(clazz);
    }

    document.querySelector("#root").replaceWith(layoutElement);
};


render();
