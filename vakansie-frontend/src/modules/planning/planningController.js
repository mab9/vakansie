import {Day} from "./planningModel.js";

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

    // only used to generate uuid
    let idCounter = 0;
    months.forEach(month => {
        let days = []

        const yyyy = today.getFullYear();
        const mm = months.indexOf(month);

        (31).times((idx) => {
            /** @type {Day} day */
            const day = Day();
            day.id = idCounter++
            day.day = idx + 1;
            day.date = new Date(yyyy, mm, idx + 1);
            day.dayoff = false;
            day.approved = 1;
            days.push(day);
        })
        calendarData.push(days)
    })

    const getCalendarData = () => calendarData;

    /**
     * @typedef PlanningController
     */
    return Object.freeze({
        getCalendarData : getCalendarData,
    });
};

