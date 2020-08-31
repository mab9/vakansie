import {Observable} from "../base/observable/observable.js";
import {HomeController, HomeView} from "../modules/home/home.js";
import {PersonController} from "../modules/person/personController.js"
import {PersonView} from "../modules/person/personView.js"
import {PlanningController} from "../modules/planning/planningController.js";
import {PlanningView} from "../modules/planning/planningView.js";

// use of imports to avoid import removal on "ctrl alt o" shortcut
const homeView = HomeView;
const homeController = HomeController;
const personView = PersonView;
const personController = PersonController;
const planningView = PlanningView;
const planningController = PlanningController;

export {Menu}

/**
 * @return {Menu}
 * @constructor
 * @param {Element} rootElement  is used by the eval function
 */
const Menu = (rootElement) => {

    const entries = JSON.parse(`{ "data" : [
                            {
                              "id":     "0",
                              "title":  "menu.main.entry.vakansie",
                              "ctrl" :  "HomeController",
                              "view" :  "HomeView",
                              "roles":  [],
                              "rights": [],
                              "subs":   []
                            },
                            {
                              "id":     "1",
                              "title":  "menu.main.entry.persons",
                              "ctrl" :  "PersonController",
                              "view" :  "PersonView",
                              "roles":  [],
                              "rights": [],
                              "subs":   []
                            },
                            {
                              "id":     "2" ,
                              "title":  "menu.main.entry.planning",
                              "ctrl" :  "PlanningController",
                              "view" :  "PlanningView",
                              "roles":  [],
                              "rights": [],
                              "subs":   []
                            }
                           ]}`);

    // initial entry
    let selectedEntry = Observable(entries.data[2])

    const setSelectedEntry = value => {
        const newEntry = entries.data.find(entry => entry.id === value)
        selectedEntry.setValue(newEntry);
    }

    // todo handle listener clean up when the view changes
    // Update the main content view
    selectedEntry.onChange(entry => {
        eval(`${entry.view}(rootElement, ${entry.ctrl}())`);
    })

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

