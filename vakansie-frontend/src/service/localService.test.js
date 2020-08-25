import { vakansieService }  from "./localService.js"
import { Suite }        from "../test/test.js";

const localServiceSuite = Suite("localService");

localServiceSuite.add("setup", assert => {

    vakansieService().loadPersons( persons => {
        assert.is(persons.length, 3);
    })

});

localServiceSuite.run();
