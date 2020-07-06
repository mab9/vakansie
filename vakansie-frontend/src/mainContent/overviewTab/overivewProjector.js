/**
 * @param rootElement
 */
const overviewProjector = ({rootElement}) => {
    const template = document.createElement("DIV");
    template.innerHTML = `
    <SECTION id="user-tab selected"></SECTION>`;

    const [view] = template.children;
    rootElement.appendChild(view);
};

export {overviewProjector}
