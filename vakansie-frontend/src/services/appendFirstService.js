export { appendFirst }

const appendFirst = rootElement => newElements => {
        rootElement.firstChild
            ? rootElement.firstChild.replaceWith(newElements)
            : rootElement.appendChild(newElements);
}
