import {onValueChange, setLabelOf, setValueOf, sizeOf, valueOf} from "../../vakansie-frontend/src/base/presentationModel/presentationModel.js";
import "../../vakansie-frontend/src/assets/util/dates.js"
import {ListController} from "../../vakansie-frontend/src/base/controller/controller.js";
import {Event} from "../../vakansie-frontend/src/calendar/event.model.js";
import {calendarService} from "../../vakansie-frontend/src/calendar/calendar.service.local.js";

export {CalendarController, itCalendarDays}

/**
 * @return Readonly {CalendarController}
 * @constructor
 */
const CalendarController = (isCtrlInitialized = false) => {  // one time creation, singleton

    const eventListCtrl = ListController();
    const holidayListCtrl = ListController();
    let calendar = calendarService.getEmptyCalendar();

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

    const initPlanningEvents = () => initEvents(calendarService.getEvents());

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

    /**
     * @typedef CalendarController
     */
    return Object.freeze({
        getCalendarData: () => calendar,
        getEventListCtrl: () => eventListCtrl,
        getHolidayListCtrl: () => holidayListCtrl,
        initHolidays: initHolidays,
        initPlanningEvents: initPlanningEvents,
    });
};


const itCalendarDays = calendar => fnc => calendar.forEach(month => month.forEach(day => fnc(day)))


