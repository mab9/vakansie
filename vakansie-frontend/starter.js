const CONTENT_WRAPPER = 'content-wrapper';
import {LayoutView} from "./src/layout/layout.js";

const loggedIn = true;

if (loggedIn) {
    LayoutView({rootElement: document.getElementById(CONTENT_WRAPPER)});
} else {
}
