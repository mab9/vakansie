const CONTENT_WRAPPER = 'content-wrapper';
import {MainContentView} from "./src/mainContent/mainContent.js";

const loggedIn = true;

if (loggedIn) {
    MainContentView({rootElement: document.getElementById(CONTENT_WRAPPER)});
} else {
}
