import {Suite} from "../test/test.js";
import {generateTable} from "./tableService.js";
import {dom} from "../assets/util/dom.js";

const util = Suite("table builder");

util.add("Build table", assert => {

    let mutants = [
        {name: "Name", nickname: "Nickname"},
        {name: "Donatello", nickname: "Donnie"},
        {name: "Michelangelo", nickname: "Mikey"}
    ];

    const elements = dom(`<table></table>`)
    const table = elements.childNodes[0];

    generateTable(table, mutants)
    assert.is(table.innerHTML, "<thead><tr><th>Name</th><th>Nickname</th></tr></thead><tbody><tr><td>Donatello</td><td>Donnie</td></tr><tr><td>Michelangelo</td><td>Mikey</td></tr></tbody>")
});

util.run();
