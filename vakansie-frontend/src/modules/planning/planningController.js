import {Day} from "./planningModel.js";
import {Attribute, LABEL, VALUE} from "../../base/presentationModel/presentationModel.js";
import {Observable} from "../../base/observable/observable.js";
import {ListController, SelectionController} from "../../base/controller/controller.js";

export {PlanningController, months}

const months2 = ["month.jan", "month.feb", "month.mar", "month.apr",
    "month.mai", "month.jul",
    "month.jun", "month.aug", "month.sep", "month.oct", "month.nov",
    "month.dez"];

const months = ["month.jan", "month.feb", "month.mar", "month.apr", "month.mai",
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

const findHolyday = date => holydays.find(holyday => {
    return holyday.day.getFullYear() === date.getFullYear() && holyday.day.getMonth() === date.getMonth() && holyday.day.getDate() === date.getDate();
})

/**
 * @return Readonly {PlanningController}
 * @constructor
 */
const PlanningController = () => {

    const listController = ListController();
    const selectionController = SelectionController("");

    let calendarData = []
    const today = new Date();

    // total available holydays
    const holydays = Observable(20);
    const isMouseDown = Observable(false);
    /** @type dragStart {Day} */
    const dragStart = Observable(undefined);
    /** @type dragCurrent {Day} */
    const dragCurrent = Observable(undefined);

    /** @type statusAdd {Attribute} */
    const statusAdd = Attribute(true);

    // only used to generate uuid
    let idCounter = 0;
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
            const holyday = findHolyday(date)

            if (holyday) {
                console.info(holyday)
            }

            day.holyday.getObs(VALUE).setValue(!!holyday)
            day.holyday.getObs(LABEL).setValue(holyday ? holyday.label : "")

            day.dayoff.getObs(VALUE).setValue(false);
            day.approved.getObs(VALUE).setValue(0);
            days.push(day);
        })
        calendarData.push(days)
    })

    const getCalendarData = () => calendarData;
    const getHolydays = () => holydays;

    /**
     * @typedef PlanningController
     */
    return Object.freeze({
        getCalendarData: getCalendarData,
        getHolydays: getHolydays,
        getDragStart: () => dragStart,
        getDragCurrent: () => dragCurrent,
        getMouseDown: () => isMouseDown,
        getStatusAdd: () => statusAdd,
    });
};

