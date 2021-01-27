import {
    Attribute,
    EDITABLE,
    onClick,
    onValueChange,
    setValueOf,
    valueOf
} from "../../base/presentationModel/presentationModel.js";
import "../../assets/util/dates.js"
import {CalendarController} from "../../calendar/calendar.controller.js";
import {GroupController} from "../groups/group.controller.js";
import {calendarService} from "../../calendar/calendar.service.local.js";
import {EventStatus} from "../../calendar/event.model.js";
import {SelectionController} from "../../base/controller/controller.js";
import {NoDay} from "../../calendar/day.model.js";

export {ApprovalController}

/**
 * @implements CalendarProjectorCtrl
 * @return Readonly {ApprovalController}
 * @constructor
 */
const ApprovalController = (isCtrlInitialized = false) => {

    const calendarCtrl = CalendarController();
    const calendar = calendarCtrl.getCalendarData();
    const eventListCtrl = calendarCtrl.getEventListCtrl();
    const selectionCtrl = SelectionController(NoDay);  // todo check replacing selection ctrl to calendar ctrl
    let dragStart = undefined;

    const groupCtrl = GroupController();
    const selectedBucket = groupCtrl.getSelectedBucket();

    const employeesLeft = Attribute(false);
    const fromDate = Attribute(undefined);
    const toDate = Attribute(undefined);
    const approveBtn = Attribute();  // btn to track clicks
    const isMouseDown = Attribute(false);


    const userEvents = []

    const addUserEventsRef = userId => events => {
        userEvents.push({
            userId: userId,
            events: events,
        });
    }


    const findUserEvents = userId => {
        const model = userEvents.find(item => item.userId === userId);
        return model ? model.events : [];
    }

    selectedBucket.onModelSelected(group => {
        if (isCtrlInitialized) {
            const approvalData = calendarService.getApprovalDataByGroup(valueOf(group.id))(groupCtrl.getListController().getAll());  // fetch it according group -> user
            calendarCtrl.clearEvents();
            valueOf(approvalData).forEach(item => {
                const events = Attribute(item.events);
                const initedEvents = calendarCtrl.initEvents(events);
                addUserEventsRef(item.userId)(initedEvents);
            })
        }
    })

    const getApprovalModel = () => {
        return {
            employeesLeft: employeesLeft,
            approveBtn: approveBtn,
            fromDate: fromDate,
            toDate: toDate,
        }
    }

    /*
        - Partial event approval
        - whole event approval
     */
    onClick(approveBtn)(_ => {  // click event
        if (!approveBtn.getObs(EDITABLE).getValue()) return; // guard
        const events = eventListCtrl.getAll();
        const from = new Date(valueOf(fromDate));
        const to = new Date(valueOf(toDate));
        const eventsFromTo = events.filter(event => valueOf(valueOf(event.from).date).isBetween(from, to))
        eventsFromTo.forEach(event => setValueOf(event.status)(EventStatus.APPROVED))

        // reset selection
        setValueOf(fromDate)(undefined)
        setValueOf(toDate)(undefined)
        calendarCtrl.clearDaySelection();
    })

    const updateApproveBtnStatus = () => {
        approveBtn.getObs(EDITABLE).setValue(valueOf(fromDate) && valueOf(toDate));
    }

    onValueChange(fromDate)(from => {
        const to = valueOf(toDate);
        if (!to || from && to && new Date(to) < new Date(from)) {
            setValueOf(toDate)(from)
        }
        updateApproveBtnStatus();
        updateDaySelection();
    })

    onValueChange(toDate)(to => {
        const from = valueOf(fromDate);
        if (!from || from && to && new Date(to) < new Date(from)) {
            setValueOf(fromDate)(to)
        }
        updateApproveBtnStatus();
        updateDaySelection();
    })

    selectionCtrl.onModelSelected((newDay, oldDay) => {
        if (newDay === NoDay) return // guard to prevent further steps - end dragging
        if (oldDay === NoDay) dragStart = newDay; // start dragging

        const start = valueOf(dragStart.date).getFormatted()
        const newDate = valueOf(newDay.date).getFormatted();

        if (start < newDate) {
            setValueOf(fromDate)(start);
            setValueOf(toDate)(newDate);
        } else {
            setValueOf(fromDate)(newDate);
            setValueOf(toDate)(start);
        }

        updateDaySelection();
    })

    const updateDaySelection = () => {
        if (!valueOf(fromDate) || !valueOf(toDate)) return;
        const from = new Date(valueOf(fromDate));
        const to = new Date(valueOf(toDate));
        calendarCtrl.changeDaySelection(from, to)
    }

    const startDragOnDay = day => {
        dragStart = day;
        setValueOf(day.isSelected)(true);
    }

    calendarCtrl.initHolidays();
    calendarCtrl.initApprovalEvents();
    isCtrlInitialized = true;

    /**
     * @typedef ApprovalController
     */
    return Object.freeze({
        getSelectionCtrl: () => selectionCtrl,
        getMouseDown: () => isMouseDown,
        getCalendarData: () => calendar,
        getGroupCtrl: () => groupCtrl,
        getEventListCtrl: () => eventListCtrl,
        findUserEvents: findUserEvents,
        getEmployeesLeft: () => employeesLeft,
        getApprovalModel,
        startDragOnDay,
    });

};
