import {Observable} from "../assets/observable/observable.js";
import {fst, Pair, snd, Tuple} from "../assets/church/rock.js";

export {Menu, MENU_HOME_VIEW, MENU_PLANNING_VIEW, MENU_USER_VIEW, MENU_ABOUT_VIEW, label, view, controller}

const MENU_HOME_VIEW = 'HomeView'
const MENU_PLANNING_VIEW = 'PlanningView'
const MENU_USER_VIEW = 'PersonView'
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

    const entries = [
        Entry('Vakansie')(MENU_HOME_VIEW)("HomeController"),
        Entry('Planner')(MENU_PLANNING_VIEW)("not implemented"),
        Entry('Persons')(MENU_USER_VIEW)("PersonController"),
        Entry('About')(MENU_ABOUT_VIEW)("not implemented")];

    // initial entry
    let selectedEntry = Observable(entries[0]);

    const setSelectedEntry = value => {
        const newEntry = entries.find(entry => entry(label) === value)
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
        getEntries: () => entries,
        getSelectedEntry: selectedEntry.getValue,
        setSelectedEntry: setSelectedEntry,
        onSelectedEntryChange: selectedEntry.onChange
    }
}

