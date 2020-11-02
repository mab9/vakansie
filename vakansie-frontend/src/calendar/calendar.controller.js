import {Day} from "./day.model.js";
import {setValueOf, valueOf} from "../base/presentationModel/presentationModel.js";
import "../assets/util/dates.js"
import {ListController} from "../base/controller/controller.js";
import {Event} from "./event.model.js";
import {styleElement} from "../assets/util/cssClasses.js";
import {calendarService} from "./calendar.service.local.js";

export {calendarController}

/**
 * @return Readonly {CalendarController}
 * @constructor
 */
const calendarController = ((isCtrlInitialized = false) => {  // one time creation, singleton

    const eventListCtrl = ListController();
    const calendar = calendarService.getInitializedCalendar();

    /** @param {Day} day */
    const createEvent = (day) => {
        const event = Event(day);
        eventListCtrl.addModel(event);
    }

    /** @param {Day} day */
    const updateEvent = (day) => {  // day => current der from to, days between müssen aktualisiert werden.
        const currentEvent = eventListCtrl.pop();

        // distinguish if to is going upwards or backwards
        if (valueOf(day.date) < valueOf(valueOf(currentEvent.start).date)) {  // going backwards
            setValueOf(currentEvent.from)(day)
            setValueOf(currentEvent.to)(valueOf(currentEvent.start))
        } else if (valueOf(day.date) === valueOf(valueOf(currentEvent.start).date)) { // is at the start point
            setValueOf(currentEvent.from)(day);
            setValueOf(currentEvent.to)(day)
        } else { // going forwards
            setValueOf(currentEvent.from)(valueOf(currentEvent.start))
            setValueOf(currentEvent.to)(day)
        }
    }

    const endEvent = () => {
        /** @type {Event} */
        const createdEvent = eventListCtrl.pop();
        /** @type {ListController} */
        const dayListCtrl = valueOf(createdEvent.days);
        /** @type {Day[]} */
        const days = dayListCtrl.getAll();
        days.forEach(day => {
            setValueOf(day.isSelected)(false);
            setValueOf(day.event)(createdEvent);
        })
    };

    const deleteEvent = event => {
        const dayListCtrl = valueOf(event.days)
        const days = dayListCtrl.getAll();
        days.forEach(day => {
            setValueOf(day.event)(false)
            const element = document.querySelector(`[data-day-id="` + valueOf(day.id) + `"]`);
            styleElement(false)("cal-day-dragged")(element)
        })
        eventListCtrl.removeModel(event)
    }

    /** @param {number} id */
    const findDayById = id => {
        const month = parseInt(id / 31);
        const day = id % 31;
        return calendar[month][day]
    }

    const getCurrentAmountEventDays = () => {
        const events = eventListCtrl.getAll();
        if (!events.length) return 0;
        return eventListCtrl.getAll().map(event => {
            return valueOf(event.days).size(); // dayListCtrl
        }).reduce((sum, val) => sum + val);
    }


    isCtrlInitialized = true;

    /**
     * @typedef calendarController
     */
    return Object.freeze({
        createEvent,
        updateEvent,
        endEvent,
        deleteEvent,
        getData: () => calendar,
        getDayById: id => findDayById(id),
        getEventListCtrl: () => eventListCtrl,
        getCreatedEvent: () => eventListCtrl.pop(),
        getCurrentAmountEventDays,
    });
})();


