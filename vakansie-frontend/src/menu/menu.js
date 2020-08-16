import {Observable} from "../assets/observable/observable.js";
import {fst, Pair, snd, Tuple} from "../assets/church/rock.js";

export {Menu, MENU_HOME_VIEW, MENU_PLANNING_VIEW, MENU_PERSON_VIEW, MENU_ABOUT_VIEW, label, view, controller}

const MENU_HOME_VIEW = 'HomeView'
const MENU_PLANNING_VIEW = 'PlanningView'
const MENU_PERSON_VIEW = 'PersonView'
const MENU_ABOUT_VIEW = 'AboutView'


// this is built without using objects, without local variables, all purely immutable

const Entry =
    first  =>
    second =>
    third  =>
    Object.seal( selector  => selector (first) (second) (third)); // seal to disallow using functions as objects

const label      = arg_1 => arg_2 => arg_3 => arg_1;
const view       = arg_1 => arg_2 => arg_3 => arg_2;
const controller = arg_1 => arg_2 => arg_3 => arg_3;

/**
 * @return {Menu}
 * @constructor
 */
const Menu = () => {

    const entries2 = JSON.parse(`{ "data" : [
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

    const entries = [
        Entry('Vakansie')(MENU_HOME_VIEW)("HomeController"),
        Entry('Planner')(MENU_PLANNING_VIEW)("not implemented"),
        Entry('Persons')(MENU_PERSON_VIEW)("PersonController"),
        Entry('About')(MENU_ABOUT_VIEW)("not implemented")];

    // initial entry
    let selectedEntry = Observable(entries[0]);
    let selectedEntry2 = Observable(entries2.data[0])

    const setSelectedEntry = value => {
        const newEntry = entries.find(entry => entry(label) === value)
        selectedEntry.setValue(newEntry);
    }

    const setSelectedEntry2 = value => {
        // todo change it to use id instead of the title
        const newEntry = entries2.data.find(entry => entry.title === value)
        selectedEntry2.setValue(newEntry);
    }

    /**
     * @typedef Menu
     * @property {function} getEntries
     * @property {function} getEntries2
     * @property {function} getSelectedEntry
     * @property {function} setSelectedEntry
     * @property {function} setSelectedEntry2
     * @property {function} onSelectedEntryChange
     * @property {function} onSelectedEntryChange2
     */
    return {
        getEntries: () => entries,
        getEntries2: () => entries2.data,
        getSelectedEntry: selectedEntry.getValue,
        getSelectedEntry2: selectedEntry2.getValue,
        setSelectedEntry: setSelectedEntry,
        setSelectedEntry2: setSelectedEntry2,
        onSelectedEntryChange: selectedEntry.onChange,
        onSelectedEntryChange2: selectedEntry2.onChange

    }
}

