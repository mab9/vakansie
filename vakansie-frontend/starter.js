const CONTENT_WRAPPER = 'content-wrapper';
import {LayoutController, LayoutView} from "./src/layout/layout.js";

const loggedIn = true;

if (loggedIn) {
    LayoutView(document.getElementById(CONTENT_WRAPPER), LayoutController());
} else {
}
