import {Suite} from "../../test/test.js"
import {dom} from "./dom.js";
import {translationService} from "../../service/translationService.js";

const util = Suite("util-dom");

util.add("Convert to HTML element", assert => {

    const element = dom(`<h1>yeah</h1>`);
    const h1 = document.createElement("h1")

    assert.is(element.childElementCount, 1);
    assert.is(element.childNodes[0].nodeName, h1.nodeName);
    assert.is(element.childNodes[0].innerHTML, "yeah");

});

util.add("Convert nested to HTML elements", assert => {

    const element = dom(`<div><h1>yeah</h1></div>`);

    const div = document.createElement("div")
    assert.is(element.childElementCount, 1);
    assert.is(element.childNodes[0].nodeName, div.nodeName);
    assert.true(element.childNodes[0].innerHTML === "<h1>yeah</h1>");

    const child = element.childNodes[0];
    const h1 = document.createElement("h1")

    assert.is(child.childElementCount, 1);
    assert.is(child.childNodes[0].nodeName, h1.nodeName);
    assert.is(child.childNodes[0].innerHTML, "yeah");

    //while (element.childNodes[0]) {
    //    console.info("test", element.childNodes[0])
    //  }
});

util.run();
