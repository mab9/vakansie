import {Observable} from "../base/observable/observable.js";
import {HomeController, HomeView} from "../modules/home/home.js";
import {PersonController} from "../modules/person/person.controller.js"
import {PersonView} from "../modules/person/person.view.js"
import {PlanningController} from "../modules/planning/planning.controller.js";
import {PlanningView} from "../modules/planning/planning.view.js";
import {VerifyController} from "../modules/verify/verify.controller.js";
import {VerifyView} from "../modules/verify/verify.view.js";
import {GroupController} from "../modules/groups/group.controller.js";
import {GroupView} from "../modules/groups/group.view.js";

// use of imports to avoid import removal on "ctrl alt o" shortcut
const homeView = HomeView;
const homeController = HomeController;
const personView = PersonView;
const personController = PersonController;
const planningView = PlanningView;
const planningController = PlanningController;
const verifyController = VerifyController;
const verifyView = VerifyView;
const groupController = GroupController;
const groupView = GroupView;

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
                            },
                            {
                              "id":     "3" ,
                              "title":  "menu.main.entry.verify",
                              "ctrl" :  "VerifyController",
                              "view" :  "VerifyView",
                              "roles":  [],
                              "rights": [],
                              "subs":   []
                            },
                            {
                              "id":     "4" ,
                              "title":  "menu.main.entry.group",
                              "ctrl" :  "GroupController",
                              "view" :  "GroupView",
                              "roles":  [],
                              "rights": [],
                              "subs":   []
                            }
                           ]}`);

    // initial entry
    let selectedEntry = Observable(entries.data[4])  // todo undo default development view

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

