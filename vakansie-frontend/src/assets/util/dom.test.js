import {Suite} from "../../test/test.js"
import {dom} from "./dom.js";

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

util.add("Convert to html and do i18n", assert => {
    const key = "test.dom.title";
    const element = dom(`<div><h1 data-i18n="${key}">yeah</h1></div>`);

    // At this moment the i18n should already have changed the inner text.
    // The translation service was not initalized and therefore the default (i18n key)
    // will be displayed!

    const div = document.createElement("div")
    assert.is(element.childElementCount, 1);
    assert.is(element.childNodes[0].nodeName, div.nodeName);
    assert.true(element.childNodes[0].innerHTML === `<h1 data-i18n="${key}">${key}</h1>`);

    const child = element.childNodes[0];
    const h1 = document.createElement("h1")

    assert.is(child.childElementCount, 1);
    assert.is(child.childNodes[0].nodeName, h1.nodeName);
    assert.is(child.childNodes[0].innerHTML, key);
});

util.run();
