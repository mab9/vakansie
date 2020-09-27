import {ALL_DAY_ATTRIBUTE_NAMES, Day} from "./planningModel.js";
import {Attribute, LABEL, VALUE, valueOf} from "../../base/presentationModel/presentationModel.js";
import "../../assets/util/dates.js"
import {ListController, SelectionController} from "../../base/controller/controller.js";
import {FromTo} from "./fromToModel.js";

export {PlanningController, months}

const months = ["month.jan", "month.feb", "month.mar", "month.apr",
    "month.mai", "month.jul",
    "month.jun", "month.aug", "month.sep", "month.oct", "month.nov",
    "month.dez"];

const months2 = ["month.jan", "month.feb", "month.mar", "month.apr", "month.mai",
    "month.jul"];

const holydays = [
    {day: new Date(2020, 0, 1), label: "Neujahr"},
    {day: new Date(2020, 0, 2), label: "Berchtoldstag"},
    {day: new Date(2020, 3, 10), label: "Karfreitag"},
    {day: new Date(2020, 3, 13), label: "Ostermontag"},
    {day: new Date(2020, 4, 21), label: "Auffahrt"},
    {day: new Date(2020, 5, 1), label: "Pfingstmontag"},
    {day: new Date(2020, 7, 1), label: "Nationalfeiertag Schweiz"},
    {day: new Date(2020, 11, 25), label: "Weihnachten"},
    {day: new Date(2020, 11, 26), label: "Stephanstag"},
]

/**
 * @return Readonly {PlanningController}
 * @constructor
 */
const PlanningController = () => {

    const fromToListController = ListController();
    const selectionController = SelectionController(NoDay);

    // total available holy days
    const holyDays = Attribute(20);
    const isMouseDown = Attribute(false);

    const calendarData = initializeCalendar();

    /** @type fromTo {FromTo} */
    let fromTo = undefined;

    /** @param {Day} day */
    const createFromTo = (day) => {
        fromTo = FromTo();
        fromTo.id.getObs(VALUE).setValue(fromToListController.size() + 1)
        day.fromToId = fromTo.id;
        fromTo.start.getObs(VALUE).setValue(day);
        fromTo.from.getObs(VALUE).setValue(day);
        fromTo.to.getObs(VALUE).setValue(day);
        fromToListController.addModel(fromTo);
    }

    const endFromTo = () => fromTo = undefined;

    /** @param {Day} day */
    const setFromTo = (day) => {
        // distinguish if to is going upwards or backwards
        if (valueOf(day.date) < valueOf(valueOf(fromTo.start).date)) {
            // going backwards
            fromTo.from.getObs(VALUE).setValue(day);
        } else if (valueOf(day.date) === valueOf(valueOf(fromTo.start).date)) {
            // is at the start point
            fromTo.from.getObs(VALUE).setValue(day);
            fromTo.to.getObs(VALUE).setValue(day);
        } else {
            // going forwards
            fromTo.to.getObs(VALUE).setValue(day);
        }
    }

    selectionController.onModelSelected(value => {
        if (valueOf(isMouseDown)) { // start selection / ongoing selection
            if (fromTo) {
                setFromTo(value)
            } else {
                createFromTo(value)
            }
        } else { // end selection
            endFromTo()
        }
    })

    /**
     * @typedef PlanningController
     */
    return Object.freeze({
        getCalendarData:         () => calendarData,          // holds year and day details  (is holiday, is weekend day,...)
        getHolyDays:             () => holyDays,              // national holidays
        getMouseDown:            () => isMouseDown,
        getSelectionController:  () => selectionController,   // current selected / hover on day
        getFromToListController: () => fromToListController,  // object { id, start day, end day, amount of days that are off, list off all days between start and end?)
        getCurrentFromTo:        () => fromTo,
    });
};

const NoDay = (() => { // one time creation, singleton
    const feb30 = Day();
    ALL_DAY_ATTRIBUTE_NAMES.forEach(name => feb30[name].setConvertedValue(""));
    return feb30;
})();

const initializeCalendar = () => {
    // only used to generate uuid
    let data = []
    let idCounter = 0;
    const today = new Date();

    months.forEach(month => {
        let days = []

        const yyyy = today.getFullYear();
        const mm = months.indexOf(month);

        (31).times((idx) => {
            /** @type {Day} day */
            const day = Day();
            day.id.getObs(VALUE).setValue(idCounter++);
            day.day.getObs(VALUE).setValue(idx + 1);

            const date = new Date(yyyy, mm, idx + 1)
            day.date.getObs(VALUE).setValue(new Date(date))
            const holyday = holydays.find(holyday => holyday.day.sameDay(date));

            day.holyday.getObs(VALUE).setValue(!!holyday)
            day.holyday.getObs(LABEL).setValue(holyday ? holyday.label : "")

            day.dayoff.getObs(VALUE).setValue(false);
            day.approved.getObs(VALUE).setValue(0);
            days.push(day);
        })
        data.push(days)
    })
    return data;
}

