import {Attribute} from "../../base/presentationModel/presentationModel.js";
import "../../assets/util/dates.js"
import {CalendarController} from "../../calendar/calendar.controller.js";
import {GroupController} from "../groups/group.controller.js";

export {VerifyController}

/**
 * @typedef VerifyController
 * @property {Function} getCalendarData
 */
const VerifyController = (isCtrlInitialized = false) => {

    const calendarCtrl = CalendarController();
    const calendar = calendarCtrl.getCalendarData();

    const groupCtrl = GroupController();
    const groupListCtrl = groupCtrl.getListController();
    const selectedBucket = groupCtrl.getSelectedBucket();


    const isMouseDown = Attribute(false);

    /*
        todos:
        todo vacation eingabe stoppen, befor die freigabe erfolgt? iergend eine strategie erarbeiten.
        cool wäre -> instant update über alle user und abstellbar falls nötig, weil zu vieles ändert..

        load groups, rules, users
        process calendar against the group, user and rule selection

        provide master view with approval buttons.
        approve events according selections

     */

    calendarCtrl.initHolidays();
    calendarCtrl.initApprovalEvents();
    isCtrlInitialized = true;

    return Object.freeze({
        getCalendarData: () => calendar,
        getGroupCtrl: () => groupCtrl,
    });
};




