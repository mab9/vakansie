import {Day} from "./planningModel.js";
import {VALUE} from "../../base/presentationModel/presentationModel.js";
import {Observable} from "../../base/observable/observable.js";

export {PlanningController, months}

const months2 = ["month.jan", "month.feb", "month.mar", "month.apr",
    "month.mai", "month.jul",
    "month.jun", "month.aug", "month.sep", "month.oct", "month.nov",
    "month.dez"];

const months = ["month.jan", "month.feb", "month.mar", "month.apr", "month.mai",
    "month.jul"];

/**
 * @return Readonly {PlanningController}
 * @constructor
 */
const PlanningController = () => {
    let calendarData = []
    const today = new Date();

    // total available holydays
    const holydays = Observable(20);

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
            day.date.getObs(VALUE).setValue(new Date(yyyy, mm, idx + 1))
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
        getCalendarData : getCalendarData,
        getHolydays : getHolydays,
    });
};

