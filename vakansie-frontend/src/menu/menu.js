import {Observable} from "../base/observable/observable.js";
import {HomeController, HomeView} from "../views/home/home.js";
import {PersonController} from "../views/person/person.controller.js"
import {PersonView} from "../views/person/person.view.js"
import {PlanningController} from "../views/planning/planning.controller.js";
import {PlanningView} from "../views/planning/planning.view.js";
import {ApprovalController} from "../views/approval/approval.controller.js";
import {ApprovalView} from "../views/approval/approval.view.js";
import {GroupController} from "../views/groups/group.controller.js";
import {GroupView} from "../views/groups/group.view.js";
import {AuthController} from "../auth/auth.prod.js";
import {config} from "../../config.js";
import {MeController, MeView} from "../views/me/me.js";

// use of imports to avoid import removal on "ctrl alt o" shortcut
const homeView = HomeView;
const homeController = HomeController;
const personView = PersonView;
const personController = PersonController;
const planningView = PlanningView;
const planningController = PlanningController;
const approvalController = ApprovalController;
const approvalView = ApprovalView;
const groupController = GroupController;
const groupView = GroupView;
const meController = MeController;
const meView = MeView;

export {Menu, roles}

const roles = {
    ADMIN: "admin",
    ADMIN_TENANT: "admin-tenant",
    EMPLOYEE: "employee"
}


/**
 * @return Readonly {Menu}
 * @constructor
 * @param {Element} rootElement  is used by the eval function
 */
const Menu = (rootElement) => {
    let entries = JSON.parse(`{ "data" : [
                            {
                              "id":      "0",
                              "title":   "menu.main.entry.vakansie",
                              "ctrl" :   "HomeController",
                              "view" :   "HomeView",
                              "roles":   [],
                              "rights":  [],
                              "subs":    [],
                              "visible": true
                            },
                            {
                              "id":      "1",
                              "title":   "menu.main.entry.persons",
                              "ctrl" :   "PersonController",
                              "view" :   "PersonView",
                              "roles":   ["${roles.ADMIN}"],
                              "rights":  [],
                              "subs":    [],
                              "visible": true
                            },
                            {
                              "id":      "2" ,
                              "title":   "menu.main.entry.planning",
                              "ctrl" :   "PlanningController",
                              "view" :   "PlanningView",
                              "roles":   [],
                              "rights":  [],
                              "subs":    [],
                              "visible": true
                            },
                            {
                              "id":      "3" ,
                              "title":   "menu.main.entry.approval",
                              "ctrl" :   "ApprovalController",
                              "view" :   "ApprovalView",
                              "roles":   ["${roles.ADMIN}"],
                              "rights":  [],
                              "subs":    [],
                              "visible": true
                            },
                            {
                              "id":      "4" ,
                              "title":   "menu.main.entry.group",
                              "ctrl" :   "GroupController",
                              "view" :   "GroupView",
                              "roles":   ["${roles.ADMIN}","${roles.ADMIN_TENANT}"],
                              "rights":  [],
                              "subs":    [],
                              "visible": true
                            },
                            {
                              "id":      "5" ,
                              "title":   "menu.main.entry.me",
                              "ctrl" :   "MeController",
                              "view" :   "MeView",
                              "roles":   [],
                              "rights":  [],
                              "subs":    [],
                              "visible": false
                            }
                           ]}`);


    const userDetails = AuthController.getUserDetails();

    const reduceMenuEntriesAccordingUserRoles = () => {
        return entries.data.filter(entry => {
            if (!entry.roles.length) return true; // no role defined then allow access
            return entry.roles.some(item => userDetails.roles.includes(item));
        })
    }

    entries.data = reduceMenuEntriesAccordingUserRoles();


    // initial entry
    let selectedEntry = Observable(entries.data[config.startMenuEntry])

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
     */
    return {
        getEntries: () => entries.data,
        getVisibleEntries: () => entries.data.filter(item => item.visible),
        getSelectedEntry: selectedEntry.getValue,
        setSelectedEntry: setSelectedEntry,
        onSelectedEntryChange: selectedEntry.onChange,
    }
}

