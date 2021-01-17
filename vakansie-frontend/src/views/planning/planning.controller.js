import {NoDay} from "../../calendar/day.model.js";
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
    const selectionCtrl = SelectionController(NoDay);

    const currentVacationContigent = Attribute(0); // total amount of events booked
    const vacationContigent = Attribute(20); // total available events within a time period (usually a year)
    const isMouseDown = Attribute(false);

    const calendar = calendarCtrl.getCalendarData();

    selectionCtrl.onModelSelected((newDay, oldDay) => {
        if (newDay === NoDay) { // end dragging
            calendarCtrl.endEvent();
            selectionCtrl.clearSelection();
        } else if (oldDay === NoDay) {  // start dragging
            calendarCtrl.createEvent(newDay);
        } else { // update drag
            calendarCtrl.updateEvent(newDay);
        }

        updateVacationContigent();
        updateDaySelection();
        updateEventDayList()
    })

    const deleteEvent = event => {
        calendarCtrl.deleteEvent(event);
        updateVacationContigent();
    }

    const updateDaySelection = () => {
        const event = calendarCtrl.getCreatedEvent()
        const from = valueOf(valueOf(event.from).date);
        const to = valueOf(valueOf(event.to).date);
        calendarCtrl.changeDaySelection(from, to)
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


    calendarCtrl.initHolidays();
    calendarCtrl.initPlanningEvents();
    updateVacationContigent();

    return Object.freeze({
        getSelectionCtrl: () => selectionCtrl,
        getMouseDown: () => isMouseDown,
        getCalendarData: () => calendar,
        getVacationContigent: () => vacationContigent,
        getCurrentVacationContigent: () => currentVacationContigent,
        getDayById: id => calendarCtrl.getDayById(id),
        deleteEvent: deleteEvent,
        getEventListCtrl: calendarCtrl.getEventListCtrl,
    });
};




