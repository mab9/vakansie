import {maybe} from "./maybe.js";

export {saveClassRemoval, addClass, styleElement}

const addClass = elements => clazz => {
    if (!HTMLCollection.prototype.isPrototypeOf(elements) && !HTMLCollection.prototype.isPrototypeOf(elements)) {
        elements.classList.add(clazz);
    } else {
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.add(clazz);
        }
    }
}

const saveClassRemoval = elements => clazz => {
    if (!HTMLCollection.prototype.isPrototypeOf(elements) && !HTMLCollection.prototype.isPrototypeOf(elements)) {
        maybe(elements.classList.contains(clazz))(() => elements.classList.remove(clazz));
    } else {
        for (let i = 0; i < elements.length; i++) {
            maybe(elements[i].classList.contains(clazz))(() => elements[i].classList.remove(clazz));
        }
    }
}


const styleElement = add => clazz => element => {
    if (add) {
        addClass(element)(clazz)
    } else {
        saveClassRemoval(element)(clazz);
    }
}
