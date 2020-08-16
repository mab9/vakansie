import {Observable} from "../assets/observable/observable.js";


export { Menu }

/**
 * @return {Menu}
 * @constructor
 */
const Menu = () => {

    const entries = JSON.parse(`{ "data" : [
                            {
                              "id":     "0",
                              "title":  "Vakansie",
                              "ctrl" :  "HomeController",
                              "view" :  "HomeView",
                              "roles":  [],
                              "rights": [],
                              "subs":   []
                            },
                            {
                              "id":     "1",
                              "title":  "Persons",
                              "ctrl" :  "PersonController",
                              "view" :  "PersonView",
                              "roles":  [],
                              "rights": [],
                              "subs":   []
                            },
                            {
                              "id":     "2" ,
                              "title":  "User",
                              "ctrl" :  "UserController",
                              "view" :  "UserView",
                              "roles":  [],
                              "rights": [],
                              "subs":   []
                            }
                           ]}`);



    // initial entry
    let selectedEntry = Observable(entries.data[0])

    const setSelectedEntry = value => {
        // todo change it to use id instead of the title
        const newEntry = entries.data.find(entry => entry.title === value)
        selectedEntry.setValue(newEntry);
    }

    /**
     * @typedef Menu
     * @property {function} getEntries
     * @property {function} getSelectedEntry
     * @property {function} setSelectedEntry
     * @property {function} onSelectedEntryChange
     */
    return {
        getEntries: () => entries.data,
        getSelectedEntry: selectedEntry.getValue,
        setSelectedEntry: setSelectedEntry,
        onSelectedEntryChange: selectedEntry.onChange,
    }
}

