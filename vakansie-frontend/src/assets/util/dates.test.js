import "./dates.js"
import { Suite } from "../../test/test.js"

const util = Suite("util-dates");

// extending the prototype of Date objects
util.add("equals", assert => {

    const today = new Date();
    assert.true(today.sameDay(today))

    const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    assert.true(!tomorrow.sameDay(today));

    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() -1);
    assert.true(!yesterday.sameDay(today));
});

// extending the prototype of Date objects
util.add("guard check", assert => {

    const today = new Date();

    try {
        today.sameDay("null");
        assert.true(0) // should never arrive to this code!
    } catch (exception) {
        assert.true(exception);
    }
});

util.run();
