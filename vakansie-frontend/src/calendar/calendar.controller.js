import {
    Attribute,
    onValueChange,
    setLabelOf,
    setValueOf,
    sizeOf,
    valueOf
} from "../base/presentationModel/presentationModel.js";
import "../assets/util/dates.js"
import {ListController} from "../base/controller/controller.js";
import {Event} from "./event.model.js";
import {styleElement} from "../assets/util/cssClasses.js";
import {calendarService} from "./calendar.service.local.js";

export {CalendarController, itCalendarDays}

/**
 * @return Readonly {CalendarController}
 * @constructor
 */
const CalendarController = (isCtrlInitialized = false) => {  // one time creation, singleton

    const eventListCtrl = ListController();
    const holidayListCtrl = ListController();
    let calendar = calendarService.getEmptyCalendar();

    // todo make async
    const initHolidays = (holidays = calendarService.getSuisseHolidays()) => {
        itCalendarDays(calendar)(day => {
            const holiday = valueOf(holidays).find(item => item.day.sameDay(valueOf(day.date)));
            if (holiday) {
                setLabelOf(day.holiday)(holiday.label)
                setValueOf(day.holiday)(true)
                holidayListCtrl.addModel(day);
            }
        })
    }

    const initEvents = eventModels => {
        return valueOf(eventModels).map(event => {
            // Provide reference from event to day
            let day = findDayByDate(event.start)
            const createdEvent = Event(day);
            setValueOf(createdEvent.approved)(event.approved)
            setValueOf(createdEvent.status)(event.status)
            let dayListCtrl = valueOf(createdEvent.days);

            // start day was already added at event creation
            while (!valueOf(day.date).sameDay(event.to)) {
                day = findDayById(valueOf(day.id) + 1)
                dayListCtrl.addModel(day)
                setValueOf(createdEvent.to)(day)
            }

            // Provide reference from day to event
            dayListCtrl.getAll().forEach(item => {
                setValueOf(item.isSelected)(false);
                valueOf(item.event).addModel(createdEvent);
            })

            // Remove reference from day to event
            eventListCtrl.onModelRemove(item => {
                if (item === createdEvent) { // guard
                    dayListCtrl = valueOf(createdEvent.days)

                    // iterate over all event days and remove ref day to event
                    dayListCtrl.getAll().forEach(value => {
                        valueOf(value.event).removeModel(createdEvent);
                    })
                }
            })

            onValueChange(createdEvent.status)(stat => {
                dayListCtrl.getAll().forEach(item => setValueOf(item.status)(stat))
            })

            eventListCtrl.addModel(createdEvent);
            return createdEvent;
        })
    }

    const clearEvents = () => {
        const shallowCopy = [...eventListCtrl.getAll()];
        shallowCopy.forEach(item => eventListCtrl.removeModel(item)); // save iteration
    }

    // todo make async
    const initApprovalEvents = () => {
        const approvalData = calendarService.getApprovalData();
        const events = Attribute(valueOf(approvalData).flatMap(item => item.events)); // todo replace attribute creation
        initEvents(events);
    }

    // todo make async
    const initPlanningEvents = () => initEvents(calendarService.getEvents());

    /** @param {Day} day */
    const createEvent = (day) => eventListCtrl.addModel(Event(day));

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
        const event = eventListCtrl.pop();
        /** @type {ListController} */
        const dayListCtrl = valueOf(event.days);
        /** @type {Day[]} */
        const days = dayListCtrl.getAll();
        days.forEach(day => {
            setValueOf(day.isSelected)(false);
            valueOf(day.event).addModel(event);
        })
    };

    const deleteEvent = event => {
        const dayListCtrl = valueOf(event.days)
        const days = dayListCtrl.getAll();
        days.forEach(day => {
            valueOf(day.event).removeModel(event);
            const element = document.querySelector(`[data-day-id="` + valueOf(day.id) + `"]`);
            styleElement(false)("cal-day-hovered")(element)
            styleElement(false)("cal-day-dragged")(element)
            styleElement(false)("cal-day-approved")(element)
        })
        eventListCtrl.removeModel(event)
    }

    /** @param {number} id */
    const findDayById = id => {
        const month = parseInt(id / 31);
        const day = id % 31;
        return calendar[month][day]
    }

    /** @param {Date} date */
    const findDayByDate = date => {
        const month = date.getMonth();
        const day = date.getDate();
        return calendar[month][day - 1]
    }

    const getCurrentAmountEventDays = () => {
        if (!eventListCtrl.size()) return 0;
        return eventListCtrl.getAll()
            .map(event => sizeOf(event.days))
            .reduce((sum, val) => sum + val);
    }

    const resetCalendar = () => {
        const safeIterate = [...eventListCtrl.getAll()]; // shallow copy as we might change listeners array while iterating
        safeIterate.forEach(event => {
            const dayListCtrl = valueOf(event.days)
            dayListCtrl.reset();
            eventListCtrl.removeModel(event)
        });
        eventListCtrl.reset();
        calendar.forEach(month => month.splice(0, month.length)); // todo check if we still have references day - event
        calendar.splice(0, calendar.length);
        calendar = calendarService.getEmptyCalendar();
        clearDaySelection();
    }

    const changeDaySelection = (from, to) => {
        for (let dayId = 0; dayId <= (12 * 31 - 1); dayId++) {
            /** @type {Day} */
            const day = findDayById(dayId);
            const isBetween = valueOf(day.date).isBetween(from, to);
            setValueOf(day.isSelected)(isBetween);
        }
    }

    const clearDaySelection = () => {
        itCalendarDays(calendar)(day => setValueOf(day.isSelected)(false))
    }

    /**
     * @typedef CalendarController
     */
    return Object.freeze({
        createEvent,
        updateEvent,
        endEvent,
        deleteEvent,
        getCalendarData: () => calendar,
        getDayById: id => findDayById(id),
        getEventListCtrl: () => eventListCtrl,
        getHolidayListCtrl: () => holidayListCtrl,
        getCreatedEvent: () => eventListCtrl.pop(),
        initHolidays: initHolidays,
        initPlanningEvents: initPlanningEvents,
        initApprovalEvents: initApprovalEvents,
        initEvents: initEvents,
        clearEvents: clearEvents,
        resetCalendar: resetCalendar,
        getCurrentAmountEventDays,
        changeDaySelection,
        clearDaySelection,
    });
};


const itCalendarDays = calendar => fnc => calendar.forEach(month => month.forEach(day => fnc(day)))


