import {Attribute, setValueOf} from "../base/presentationModel/presentationModel.js";
import {Day} from "./day.model.js";
import "../assets/util/times.js"

export {calendarService, months}

const yyyy = new Date().getFullYear();

// those are the holidays from 2020
const suisseHolidays = [
  {day: new Date(yyyy, 0, 1), label: "Neujahr"},
  {day: new Date(yyyy, 0, 2), label: "Berchtoldstag"},
  {day: new Date(yyyy, 3, 10), label: "Karfreitag"},
  {day: new Date(yyyy, 3, 13), label: "Ostermontag"},
  {day: new Date(yyyy, 4, 21), label: "Auffahrt"},
  {day: new Date(yyyy, 5, 1), label: "Pfingstmontag"},
  {day: new Date(yyyy, 7, 1), label: "Nationalfeiertag Schweiz"},
  {day: new Date(yyyy, 11, 25), label: "Weihnachten"},
  {day: new Date(yyyy, 11, 26), label: "Stephanstag"},
]

const months = ["month.jan", "month.feb", "month.mar", "month.apr", "month.mai", "month.jul",
    "month.jun", "month.aug", "month.sep", "month.oct", "month.nov", "month.dez"];


const events = [
    {id: 1, start: new Date(yyyy, 2, 16), to: new Date(yyyy, 2, 20), approved: true, amount: undefined, days : undefined},
    {id: 2, start: new Date(yyyy, 4, 22), to: new Date(yyyy, 4, 29), approved: false, amount: undefined, days : undefined},
    {id: 2, start: new Date(yyyy, 5, 2), to: new Date(yyyy, 5, 5), approved: true, amount: undefined, days : undefined},
    {id: 3, start: new Date(yyyy, 6, 16), to: new Date(yyyy, 7, 14), approved: false, amount: undefined, days : undefined},
    {id: 4, start: new Date(yyyy, 11, 21), to: new Date(yyyy, 11, 31), approved: true, amount: undefined, days : undefined},
]

const loadApprovalData = () => {
  return [
    {
        userId: 3,
        email: "mab9.test@gmail.com",
        events: [
            {id: 1,start: new Date(yyyy, 6, 1),to: new Date(yyyy, 7, 1),approved: false,amount: undefined,days: undefined},
            {id: 2,start: new Date(yyyy, 8, 1),to: new Date(yyyy, 8, 15),approved: false,amount: undefined,days: undefined},
            {id: 3,start: new Date(yyyy, 9, 1),to: new Date(yyyy, 9, 6),approved: false,amount: undefined,days: undefined}]
    },
    {
      userId: 4,
      email: "gibbs@gmail.com",
      events: [
            {id: 30,start: new Date(yyyy, 6, 15),to: new Date(yyyy, 7, 15),approved: false,amount: undefined,days: undefined}, // overlapping event
            {id: 31,start: new Date(yyyy, 8, 16), to: new Date(yyyy, 9, 1),approved: false,amount: undefined,days: undefined}, // adjacent event
            {id: 32,start: new Date(yyyy, 11, 1),to: new Date(yyyy, 11, 6),approved: false,amount: undefined,days: undefined}]// non overlapping event
    }]
}


const getEmptyCalendar = () => {
    let data = []
    let idCounter = 0;

    months.forEach(month => {
        let days = []

        //const yyyy = new Date().getFullYear(); already declared in the upper scope
        const mm = months.indexOf(month);

        (31).times((idx) => {
            /** @type {Day} day */
            const day = Day();
            setValueOf(day.id)(idCounter++)
            setValueOf(day.day)(idx + 1)

            const date = new Date(yyyy, mm, idx + 1)
            setValueOf(day.date)(new Date(date))
            days.push(day);
        })
        data.push(days)
    })
    return data;
}


const calendarService = (() => { // one time creation, singleton

  const getSuisseHolidays = () => Attribute(suisseHolidays);
  const getEvents = () => Attribute(events);
  const getApprovalData = () => Attribute(loadApprovalData());

  return {
    getSuisseHolidays,
    getEmptyCalendar,
    getEvents,
    getApprovalData,
  }
})();
