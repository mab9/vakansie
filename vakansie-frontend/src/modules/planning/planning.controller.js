import {ALL_DAY_ATTRIBUTE_NAMES, Day} from "../../calendar/day.model.js";
import {Attribute, setValueOf, valueOf} from "../../base/presentationModel/presentationModel.js";
import "../../assets/util/dates.js"
import {SelectionController} from "../../base/controller/controller.js";
import {CalendarController} from "../../calendar/calendar.controller.js";

export {PlanningController}

/**
 * @typedef PlanningController
 * @property {Function} getSelectionCtrl
 * @property {Function} getMouseDown
 * @property {Function} getCalendarData
 * @property {Function} getVacationContigent
 * @property {Function} currentVacationContigent
 * @property {Function} getDayById
 * @property {Function} createEvent
 * @property {Function} updateEvent
 * @property {Function} endEvent
 * @property {Function} deleteEvent
 * @property {Function} getEventListCtrl
 */
const PlanningController = (isCtrlInitialized = false) => {

    const calendarCtrl = CalendarController();
    const selectionCtrl = SelectionController(NoDay);  // selection ctrl wird später für das syncen über verschiedene devices benötigt.

    const currentVacationContigent = Attribute(0); // total amount of events booked
    const vacationContigent = Attribute(20); // total available events within a time period (usually a year)
    const isMouseDown = Attribute(false);

    const calendar = calendarCtrl.getCalendarData();

    const isDayInRangeFromToEvent = day => {
        const event = calendarCtrl.getCreatedEvent()

        const from = valueOf(valueOf(event.from).id);
        const to = valueOf(valueOf(event.to).id);
        const dayValue = valueOf(day.id);

        return from <= dayValue && to >= dayValue;
    }

    const changeDaySelection = () => {
        for (let dayId = 0; dayId <= (12 * 31 - 1); dayId++) {
            /** @type {Day} */
            const day = calendarCtrl.getDayById(dayId);
            const isBetween = isDayInRangeFromToEvent(day)
            setValueOf(day.isSelected)(isBetween);
        }
    }

    const updateEventDayList = () => {
        /** @type {ListController} */
        const dayListCtrl = valueOf(calendarCtrl.getCreatedEvent().days);
        for (let dayId = 0; dayId <= (12 * 31 - 1); dayId++) {
            const day = calendarCtrl.getDayById(dayId);
            // remove or add the day to / from the list if it is present or not
            if (valueOf(day.isSelected)) {
                if (!dayListCtrl.findById(valueOf(day.id))) {
                    dayListCtrl.addModel(day);
                }
            } else {
                if (dayListCtrl.findById(valueOf(day.id))) {
                    dayListCtrl.removeModel(day);
                }
            }
        }
    }

    const updateVacationContigent = () => setValueOf(currentVacationContigent)(calendarCtrl.getCurrentAmountEventDays())

    const createEvent = day => {
        calendarCtrl.createEvent(day);
        selectionCtrl.setSelectedModel(day);
        updateVacationContigent();
    }

    const updateEvent = day => {
        calendarCtrl.updateEvent(day);
        selectionCtrl.setSelectedModel(day);
        updateVacationContigent();
    }

    const endEvent = () => {
        calendarCtrl.endEvent();
        selectionCtrl.clearSelection();
        updateVacationContigent();
    }

    const deleteEvent = event => {
        calendarCtrl.deleteEvent(event);
        updateVacationContigent();
    }


    // todo replace code to calendar?
    selectionCtrl.onModelSelected(day => {
        if (!valueOf(day.id)) return // guard to prevent further steps when "noday" is selected
        changeDaySelection();
        updateEventDayList()
    })


    calendarCtrl.initHolidays();
    calendarCtrl.initEvents();
    updateVacationContigent();

    isCtrlInitialized = true;

    return Object.freeze({
        getSelectionCtrl: () => selectionCtrl,
        getMouseDown: () => isMouseDown,
        getCalendarData: () => calendar,
        getVacationContigent: () => vacationContigent,
        getCurrentVacationContigent: () => currentVacationContigent,
        getDayById: id => calendarCtrl.getDayById(id),
        createEvent,
        updateEvent,
        endEvent,
        deleteEvent: deleteEvent,
        getEventListCtrl: calendarCtrl.getEventListCtrl,
    });
};

const NoDay = (() => { // one time creation, singleton
    const feb30 = Day();
    ALL_DAY_ATTRIBUTE_NAMES.forEach(name => feb30[name].setConvertedValue(""));
    return feb30;
})();


