import {i18n} from "../../service/translationService.js";

export {dom}

const dom = innerString => {
    let frag = document.createDocumentFragment();

    var elem = document.createElement('div');
    elem.innerHTML = innerString;

    while (elem.childNodes[0]) {
        frag.appendChild(elem.childNodes[0]);
    }

    // i18n translation
    const nodes = frag.querySelectorAll('[data-i18n]');
    nodes.forEach(node => {
        const key = node.dataset.i18n;
        i18n(key)(node);
    })

    return frag;
};
