import {translationService} from "./translationService.js";

const util = Suite("translation-service");



// i18n
// translate? // dom translation?

util.add("Convert to HTML element", assert => {

    const element = dom(`<h1>yeah</h1>`);
    const h1 = document.createElement("h1")

    assert.is(element.childElementCount, 1);
    assert.is(element.childNodes[0].nodeName, h1.nodeName);
    assert.is(element.childNodes[0].innerHTML, "yeah");

});

util.run();
