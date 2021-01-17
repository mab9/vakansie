import {Attribute, setValueOf} from "../base/presentationModel/presentationModel.js";
import {Day} from "./day.model.js";
import "../assets/util/times.js"
import {
    uuidUser0,
    uuidUser1,
    uuidUser2,
    uuidUser3,
    uuidUser4,
    uuidUser5
} from "../views/person/person.service.local.js";
import {groupService} from "../views/groups/group.service.local.js";
import {EventStatus} from "./event.model.js";

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
    {id: 1, start: new Date(yyyy, 2, 16), to: new Date(yyyy, 2, 20), approved: true, status: EventStatus.REQUESTED, amount: undefined, days : undefined},
    {id: 2, start: new Date(yyyy, 4, 22), to: new Date(yyyy, 4, 29), approved: false, status: EventStatus.REJECTED, amount: undefined, days : undefined},
    {id: 2, start: new Date(yyyy, 5, 2), to: new Date(yyyy, 5, 5), approved: true, status: EventStatus.APPROVED, amount: undefined, days : undefined},
    {id: 3, start: new Date(yyyy, 6, 16), to: new Date(yyyy, 7, 14), approved: false, status: EventStatus.REJECTED, amount: undefined, days : undefined},
    {id: 4, start: new Date(yyyy, 11, 21), to: new Date(yyyy, 11, 31), approved: true, status: EventStatus.APPROVED, amount: undefined, days : undefined},
]

const approvalData = () => {
  return [
    {
        userId: uuidUser0,
        events: [
            {id: 1,start: new Date(yyyy, 3, 1),to: new Date(yyyy, 3, 30),approved: false, status: EventStatus.APPROVED, amount: undefined,days: undefined},
            {id: 2,start: new Date(yyyy, 7, 1),to: new Date(yyyy, 7, 15),approved: false, status: EventStatus.APPROVED,amount: undefined,days: undefined},
            {id: 3,start: new Date(yyyy, 9, 1),to: new Date(yyyy, 9, 6),approved: false, status: EventStatus.REJECTED,amount: undefined,days: undefined}]
    },
    {
      userId: uuidUser1,
      events: [
            {id: 30,start: new Date(yyyy, 3, 15),to: new Date(yyyy, 4, 15),approved: false, status: EventStatus.APPROVED,amount: undefined,days: undefined},
            {id: 31,start: new Date(yyyy, 7, 16), to: new Date(yyyy, 7, 31),approved: false, status: EventStatus.APPROVED,amount: undefined,days: undefined},
            {id: 31,start: new Date(yyyy, 11, 20), to: new Date(yyyy, 11, 27),approved: false, status: EventStatus.REJECTED,amount: undefined,days: undefined},
            {id: 32,start: new Date(yyyy, 11, 1),to: new Date(yyyy, 11, 6),approved: false, status: EventStatus.REJECTED,amount: undefined,days: undefined}]
    },
    {
      userId: uuidUser2,
      events: [
            {id: 60,start: new Date(yyyy, 1, 1),to: new Date(yyyy, 1, 4),approved: false, status: EventStatus.APPROVED,amount: undefined,days: undefined},
            {id: 61,start: new Date(yyyy, 11, 4), to: new Date(yyyy, 11, 6),approved: false, status: EventStatus.APPROVED,amount: undefined,days: undefined},
            {id: 62,start: new Date(yyyy, 11, 15),to: new Date(yyyy, 11, 19),approved: false, status: EventStatus.REJECTED,amount: undefined,days: undefined}]
    },
    {
      userId: uuidUser3,
      events: [
            {id: 90,start: new Date(yyyy, 4, 19),to: new Date(yyyy, 4, 26),approved: false, status: EventStatus.REJECTED,amount: undefined,days: undefined},
            {id: 91,start: new Date(yyyy, 9, 4), to: new Date(yyyy, 9, 9),approved: false, status: EventStatus.REJECTED,amount: undefined,days: undefined},
            {id: 91,start: new Date(yyyy, 11, 20), to: new Date(yyyy, 11, 28),approved: false, status: EventStatus.REJECTED,amount: undefined,days: undefined}]
    },
    {
      userId: uuidUser4,
      events: [
            {id: 190,start: new Date(yyyy, 8, 1),to: new Date(yyyy, 8, 4),approved: false, status: EventStatus.APPROVED,amount: undefined,days: undefined},
            {id: 191,start: new Date(yyyy, 11, 15), to: new Date(yyyy, 11, 27),approved: false, status: EventStatus.REJECTED,amount: undefined,days: undefined}]
    },
    {
      userId: uuidUser5,
      events: [
            {id: 1290,start: new Date(yyyy, 2, 21),to: new Date(yyyy, 2, 26),approved: false, status: EventStatus.APPROVED,amount: undefined,days: undefined},
            {id: 1291,start: new Date(yyyy, 4, 16), to: new Date(yyyy, 4, 21),approved: false, status: EventStatus.APPROVED,amount: undefined,days: undefined},
            {id: 1291,start: new Date(yyyy, 7, 25), to: new Date(yyyy, 7, 28),approved: false, status: EventStatus.APPROVED,amount: undefined,days: undefined},
            {id: 1291,start: new Date(yyyy, 9, 1), to: new Date(yyyy, 9, 7),approved: false, status: EventStatus.REJECTED,amount: undefined,days: undefined},
            {id: 1291,start: new Date(yyyy, 11, 24), to: new Date(yyyy, 11, 28),approved: false, status: EventStatus.REJECTED,amount: undefined,days: undefined}]
    }]
}

const loadApprovalDataByGroup = groupId => allGroups => {
    const userListCtrl = groupService().loadGroupUsers(groupId)(allGroups);
    return approvalData().filter(item => userListCtrl.findById(item.userId));
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
  const getApprovalData = () => Attribute(approvalData());
  const getApprovalDataByGroup = groupId => groups => Attribute(loadApprovalDataByGroup(groupId)(groups));

  return {
    getSuisseHolidays,
    getEmptyCalendar,
    getEvents,
    getApprovalData,
    getApprovalDataByGroup,
  }
})();
