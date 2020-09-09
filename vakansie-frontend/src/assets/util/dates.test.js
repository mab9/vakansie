import "./dates.js"
import {Suite} from "../../test/test.js"

const util = Suite("util-dates");

util.add("equals", assert => {

    const day = new Date(2019, 5, 6);
    assert.true(day.sameDay(day))

    const tomorrow = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
    assert.true(!tomorrow.sameDay(day));

    const yesterday = new Date(day.getFullYear(), day.getMonth(), day.getDate() - 1);
    assert.true(!yesterday.sameDay(day));
});

util.add("guard check", assert => {

    const day = new Date(2019, 5, 6);

    try {
        day.sameDay("null");
        assert.true(0) // should never arrive to this code!
    } catch (exception) {
        assert.true(exception);
    }

    try {
        day.between("null", new Date());
        assert.true(0) // should never arrive to this code!
    } catch (exception) {
        assert.true(exception);
    }

    try {
        day.between(new Date(), false);
        assert.true(0) // should never arrive to this code!
    } catch (exception) {
        assert.true(exception);
    }
});

util.add("between", assert => {

    const day = new Date(2019, 5, 6);
    const yesterday = new Date(day.getFullYear(), day.getMonth(), day.getDate() - 1);
    const nextWeek = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 7);

    assert.true(day.between(yesterday, nextWeek));
    assert.true(!yesterday.between(day, nextWeek));
    assert.true(!nextWeek.between(day, yesterday));
});

util.add("count days between", assert => {

    const day = new Date(2019, 5, 6);
    const yesterday = new Date(day.getFullYear(), day.getMonth(), day.getDate() - 1);
    const nextWeek = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 7);
    const lastYear = new Date(day.getFullYear() - 1, day.getMonth(), day.getDate());

    assert.is(day.daysBetween(day), 0)
    assert.is(day.daysBetween(yesterday), 1)
    assert.is(day.daysBetween(nextWeek), 7)
    assert.is(lastYear.daysBetween(day), 365)
    assert.is(day.daysBetween(lastYear), 365)
})

util.run();
