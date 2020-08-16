import {Suite} from "../test/test.js"
import {Menu} from "./menu.js";

const util = Suite("menu-json");

util.add("Json Menu to JS object", assert => {

    const menu = Menu();
    assert.is(menu.getEntries()[0].id, '0');
    assert.is(menu.getEntries()[0].title, 'Vakansie');
    assert.is(menu.getEntries()[0].ctrl, 'HomeController');
});

util.add("Sorted menu entries", assert => {

    const menu = Menu();
    assert.is(menu.getEntries()[0].id, '0');
    assert.is(menu.getEntries()[0].title, 'Vakansie');

    assert.is(menu.getEntries()[1].id, '1');
    assert.is(menu.getEntries()[1].title, 'Persons');
});

util.add("Selected entry", assert => {

    const menu = Menu();
    assert.is(menu.getSelectedEntry().id, '0');
    assert.is(menu.getSelectedEntry().title, 'Vakansie');

    menu.setSelectedEntry('Persons')

    assert.is(menu.getSelectedEntry().id, '1');
    assert.is(menu.getSelectedEntry().title, 'Persons');
})

util.run();
