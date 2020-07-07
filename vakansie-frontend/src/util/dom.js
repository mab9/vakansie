export {dom}

const dom = innerString => {
    let frag = document.createDocumentFragment();

    var elem = document.createElement('div');
    elem.innerHTML = innerString;

    while (elem.childNodes[0]) {
        frag.appendChild(elem.childNodes[0]);
    }
    return frag;
};
