import {appendFirst} from "../util/appendFirst.js";

export {sideNavProjector}

const sideNavProjector = ({rootElement}) => {

    const renderSideNav = () => {
        const template = document.createElement("DIV");
        appendFirst(rootElement)(template)
    };

    renderSideNav();
};

