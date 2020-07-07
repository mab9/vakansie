import {appendFirst} from "../util/appendFirst.js";

const sideNavProjector = ({rootElement}) => {

    const renderSideNav = () => {
        const template = document.createElement("DIV");
        appendFirst(rootElement)(template)
    };

    renderSideNav();
};

export {sideNavProjector}
