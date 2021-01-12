import {LayoutController, LayoutView} from "./src/layout/layout.js";
import {dom} from "./src/assets/util/dom.js";
import {AuthController} from "./src/auth/auth.js";
import {LandingView} from "./src/landing/landing.view.js";

export {start} ;

const start = (appRootId) => {

    const CONTENT_WRAPPER = 'root';
    const layoutController = LayoutController();

    // todo: think about resetting the model world on a possible re-render
    const root = document.getElementById(CONTENT_WRAPPER)
    const vakansie = dom(`<div id="${appRootId}">`);

    if (AuthController.isLoggedIn()) {
        LayoutView(vakansie, layoutController);
        root.replaceWith(vakansie); // why replace???
    } else {
        LandingView(root);
    }
}
