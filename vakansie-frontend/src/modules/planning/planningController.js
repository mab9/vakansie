import {Day} from "./planningModel.js";
import {Attribute, LABEL, VALUE} from "../../base/presentationModel/presentationModel.js";
import "../../assets/util/dates.js"
import {ListController, SelectionController} from "../../base/controller/controller.js";

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

    const listController = ListController();
    const selectionController = SelectionController("");

    // total available holydays
    const holydays = Attribute(20);
    const isMouseDown = Attribute(false);
    /** @type dragStart {Attribute} */
    const dragStart = Attribute(undefined);
    /** @type dragCurrent {Attribute} */
    const dragCurrent = Attribute(undefined);

    /** @type statusAdd {Attribute} */
    const statusAdd = Attribute(true);

    const calendarData = initializeCalendar();

    const fromDay = Attribute(undefined);
    const toDay = Attribute(undefined);

    /**
     * @typedef PlanningController
     */
    return Object.freeze({
        getCalendarData: () => calendarData,
        getHolydays: () => holydays,
        getDragStart: () => dragStart,
        getDragCurrent: () => dragCurrent,
        getMouseDown: () => isMouseDown,
        getStatusAdd: () => statusAdd,
        getFromDay: () => fromDay,
        getToDay: () => toDay,
    });
};

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

