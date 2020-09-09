export { appendFirst, appendReplacing }

const appendFirst = rootElement => newElements => {
        rootElement.firstChild
            ? rootElement.firstChild.replaceWith(newElements)
            : rootElement.appendChild(newElements);
}

const appendReplacing = rootElement => newElements => {
    while (rootElement.hasChildNodes()) {
        rootElement.removeChild(rootElement.firstChild);
    }
    rootElement.appendChild(newElements);
}
