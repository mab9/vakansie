import { Suite }            from "../test/test.js"

const util = Suite("menu-json");

util.add("Json Menu to JS object", assert => {

    const menuEntries = `{ "data" : [
                            { "id":"0" , "title":"User" },
                            { "id":"1" , "title":"Planner" },
                            { "id":"2" , "title":"License" }
                           ]}`;


    const menu = JSON.parse(menuEntries)

    assert.true(menu);
    assert.true(menu.data.length === 3);

    assert.is(menu.data[0].id, '0');
    assert.is(menu.data[0].title, 'User');


    assert.is(Object.keys(menu)[0], 'data')
    assert.is(Object.keys(menu.data[0])[0], 'id')
    assert.is(Object.keys(menu.data[0])[1], 'title')

    assert.is(menu.data[0].id, '0')
    assert.is(menu.data[0].title, 'User')
});


util.add("Menu entries sorting", assert => {
    const menuEntries = `{ "data" : [
                            { "id":"0" , "title":"User" },
                            { "id":"1" , "title":"Planner" },
                            { "id":"2" , "title":"License" }
                           ]}`;

    const menu = JSON.parse(menuEntries)

    assert.is(menu.data[0].id, '0')
    assert.is(menu.data[0].title, 'User')

    assert.is(menu.data[1].id, '1')
    assert.is(menu.data[1].title, 'Planner')

    assert.is(menu.data[2].id, '2')
    assert.is(menu.data[2].title, 'License')
});

util.run();
