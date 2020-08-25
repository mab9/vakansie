
import {LayoutController, LayoutView} from "./src/layout/layout.js";
import {dom} from "./src/assets/util/dom.js";

export { start } ;

const start = (appRootId, persons) => {

    const CONTENT_WRAPPER = 'root';
    const loggedIn = true;

    const layoutController = LayoutController();

    const render = () => {

        // todo: think about resetting the model world on a possible re-render

        const root = document.getElementById(CONTENT_WRAPPER)
        const vakansie = dom(`<div id="${appRootId}">`);

        if (loggedIn) {
            LayoutView(vakansie, layoutController);
        } else {
            alert("not implemented at the moment")
        }

        root.replaceWith(vakansie);
    }

    render();
}
