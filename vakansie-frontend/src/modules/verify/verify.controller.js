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


    calendarCtrl.initHolidays();
    isCtrlInitialized = true;

    return Object.freeze({
        getCalendarData: () => calendar,
    });
};


