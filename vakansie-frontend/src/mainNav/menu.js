import {Observable} from "../assets/observable/observable.js";
import {fst, Pair, snd, Tuple} from "../assets/church/rock.js";

export {menu}

/**
 * @return {Menu}
 * @constructor
 */
const Menu = () => {

    const entries = [
        Pair("Vakansie")("HomeView"),
        Pair("Planner")("PlanningView"),
        Pair("User")("UserView"),
        Pair("About")("AboutView")];

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
