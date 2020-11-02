import {Attribute, setLabelOf, setValueOf, valueOf} from "../base/presentationModel/presentationModel.js";
import {Day} from "./day.model.js";
import "../assets/util/times.js"

export {calendarService, months}

const suisseHolidays = [
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

const months = ["month.jan", "month.feb", "month.mar", "month.apr", "month.mai", "month.jul",
    "month.jun", "month.aug", "month.sep", "month.oct", "month.nov", "month.dez"];


const initializeCalendar = holidays => {
    // only used to generate uuid
    let data = []
    let idCounter = 0;
    const today = new Date();

    // add holidays
    // add events
    // add weekends / display calendar


    months.forEach(month => {
        let days = []

        const yyyy = today.getFullYear();
        const mm = months.indexOf(month);

        (31).times((idx) => {
            /** @type {Day} day */
            const day = Day();
            setValueOf(day.id)(idCounter++)
            setValueOf(day.day)(idx + 1)

            const date = new Date(yyyy, mm, idx + 1)
            const holiday = valueOf(holidays).find(holiday => holiday.day.sameDay(date));

            setValueOf(day.date)(new Date(date))
            setValueOf(day.holiday)(!!holiday)
            setLabelOf(day.holiday)(holiday ? holiday.label : "")
            days.push(day);
        })
        data.push(days)
    })
    return data;
}


const calendarService = (() => { // one time creation, singleton

    const getSuisseHolidays = () => Attribute(suisseHolidays);
    const getInitializedCalendar = () => initializeCalendar(getSuisseHolidays());


    return {
        getSuisseHolidays,
        getInitializedCalendar,
    }
})();
