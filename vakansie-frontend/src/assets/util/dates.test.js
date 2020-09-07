import "./dates.js"
import { Suite } from "../../test/test.js"

const util = Suite("util-dates");

util.add("equals", assert => {

    const today = new Date();
    assert.true(today.sameDay(today))

    const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    assert.true(!tomorrow.sameDay(today));

    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() -1);
    assert.true(!yesterday.sameDay(today));
});

util.add("guard check", assert => {

    const today = new Date();

    try {
        today.sameDay("null");
        assert.true(0) // should never arrive to this code!
    } catch (exception) {
        assert.true(exception);
    }

    try {
        today.between("null", new Date());
        assert.true(0) // should never arrive to this code!
    } catch (exception) {
        assert.true(exception);
    }

    try {
        today.between(new Date(), false);
        assert.true(0) // should never arrive to this code!
    } catch (exception) {
        assert.true(exception);
    }
});

util.add("between", assert => {

    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() -1);
    const nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);

    assert.true(today.between(yesterday, nextWeek));
    assert.true(!yesterday.between(today, nextWeek));
    assert.true(!nextWeek.between(today, yesterday));
});

util.run();
