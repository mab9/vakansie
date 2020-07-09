import {Observable} from "../assets/observable/observable.js";
import {fst, Pair, snd, Tuple} from "../assets/church/rock.js";

export {menu, MENU_HOME_VIEW, MENU_PLANNING_VIEW, MENU_USER_VIEW, MENU_ABOUT_VIEW}

const MENU_HOME_VIEW = 'HomeView'
const MENU_PLANNING_VIEW = 'PlanningView'
const MENU_USER_VIEW = 'UserView'
const MENU_ABOUT_VIEW = 'AboutView'

/**
 * @return {Menu}
 * @constructor
 */
const Menu = () => {

    const entries = [
        Pair('Vakansie')(MENU_HOME_VIEW),
        Pair('Planner')(MENU_PLANNING_VIEW),
        Pair('User')(MENU_USER_VIEW),
        Pair('About')(MENU_ABOUT_VIEW)];

    let selectedEntry = Observable(entries[0]);

    const setSelectedEntry = label => {
        const newEntry = entries.find(entry => entry(fst) === label)
        selectedEntry.setValue(newEntry);
    }

//    const label = fst;
//    const view = snd;

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

const menu = Menu();
