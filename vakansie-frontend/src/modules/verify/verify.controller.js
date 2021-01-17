import {Attribute} from "../../base/presentationModel/presentationModel.js";
import "../../assets/util/dates.js"
import {CalendarController} from "../../calendar/calendar.controller.js";

export {VerifyController}

/**
 * @typedef VerifyController
 * @property {Function} getCalendarData
 */
const VerifyController = (isCtrlInitialized = false) => {

    const calendarCtrl = CalendarController();
    const calendar = calendarCtrl.getCalendarData();

    const isMouseDown = Attribute(false);

    /*
        provess events:
        1. load
        2. create all calendar days
        3. go throug each event and link to a day
        4. link day to an event

        process rules
     */

    // todo vacation eingabe stoppen, befor die freigabe erfolgt? iergend eine strategie erarbeiten.
    // cool wäre -> instant update über alle user und abstellbar falls nötig, weil zu vieles ändert..


    calendarCtrl.initHolidays();
    calendarCtrl.initApprovalEvents();
    isCtrlInitialized = true;

    return Object.freeze({
        getCalendarData: () => calendar,
    });
};




