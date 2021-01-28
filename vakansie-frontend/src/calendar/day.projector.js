import {
    Attribute,
    labelOf,
    onHoverChange,
    onValueChange,
    setHoverOf,
    setValueOf,
    sizeOf,
    valueOf
} from "../base/presentationModel/presentationModel.js";
import {maybe} from "../assets/util/maybe.js";
import {addClass, addClassNoSelection, saveClassRemovalNoSelection, styleElement} from "../assets/util/cssClasses.js";
import {dom} from "../assets/util/dom.js";
import {EventStatus} from "./event.model.js";
import {setTooltip} from "../assets/util/utils.js";

export {dayProjector}

/**
 * @param  rootElement {HTMLElement}
 * @param  day {Day}
 * @param  controller {CalendarProjectorCtrl}
 * @param  activateEventCounter {boolean}
 */
const dayProjector = (rootElement, day, controller, activateEventCounter) => {

    const containerElement = dom(`<div></div>`)
    const element = containerElement.querySelector("div");



    element.dataset.dayId = valueOf(day.id);

    const isMouseDown = controller.getMouseDown();
    const selectionCtrl = controller.getSelectionCtrl();


    setDayStyles(element, day);
    setDayHoverListeners(element, day);
    setDayStatusListener(element, day);
    setMouseEventListener(element, isMouseDown, selectionCtrl, day);

    // is only defined for approval controller
    if (activateEventCounter) {
        setDayEventCounterListener(element, controller, day);
    }

    rootElement.appendChild(containerElement)
}

/**
 * @param dayElement {HTMLElement}
 * @param day {Day}
 */
const setDayStyles = (dayElement, day) => {

    onValueChange(day.isSelected)(isSelected => styleElement(isSelected)("cal-day-dragged")(dayElement));

    if (valueOf(day.holiday)) {
        addClass(dayElement)("cal-holiday");
        setTooltip(dayElement)(labelOf(day.holiday));
    }

    styleElement(day.isWeekendDay())("cal-weekend-day")(dayElement)
    styleElement(!day.isInMonth())("cal-not-in-month")(dayElement)
}

/**
 * @param dayElement {HTMLElement}
 * @param day {Day}
 */
const setDayStatusListener = (dayElement,  day) => {

    const resetDayStyle = () => {

        // reset event status
        for (const status in EventStatus) {
             dayElement.classList.remove("cal-day-" + status.toLowerCase());
        }

        const dayEvent = valueOf(day.event).getAll()[0];

        if (dayEvent) {
            const dayStatus = valueOf(dayEvent.status);
            // init day status todo check if this is the right place
            setValueOf(day.status)(dayStatus)
            if (dayStatus) { // prevent marking of events which go over the weekend or holidays
                styleElement(day.isNaturalDay())("cal-day-" + dayStatus.toLowerCase())(dayElement)
            }
        }
    }

    resetDayStyle(); // init

    valueOf(day.event).onModelAdd(resetDayStyle)
    valueOf(day.event).onModelRemove(resetDayStyle)
    onValueChange(day.status)(resetDayStyle)

}



/**
 * @param dayElement {HTMLElement}
 * @param day {Day}
 */
const setDayHoverListeners = (dayElement, day) => {

    const styleDayOnHover = isHovered => styleElement(isHovered)("cal-day-hovered")(dayElement)
    onHoverChange(day.id)(isHovered => styleDayOnHover(isHovered));
    onHoverChange(day.event)(isHovered => styleDayOnHover(isHovered));
    onHoverChange(day.holiday)(isHovered => styleDayOnHover(isHovered));

    const isHoverOnDay = Attribute(false);
    dayElement.onmouseover = _ => setValueOf(isHoverOnDay)(true);
    dayElement.onmouseleave = _ => setValueOf(isHoverOnDay)(false);

    onValueChange(isHoverOnDay)(isHovered => {
        setHoverOf(day.id)(isHovered);
        setHoverOf(day.event)(isHovered);
        setHoverOf(day.holiday)(isHovered);
    })
}

/**
 * @param dayElement {HTMLElement}
 * @param approvalCtrl {ApprovalController}
 * @param day {Day}
 */
const setDayEventCounterListener = (dayElement, approvalCtrl, day) => {

    const employeesLeft = approvalCtrl.getEmployeesLeft();
    const groupCtrl = approvalCtrl.getGroupCtrl();
    const selectedBucket = groupCtrl.getSelectedBucket()

    const resetCounter = () => {
        dayElement.innerHTML = "";

        if (day.isNaturalDay() && !!sizeOf(day.event)) {
            if (valueOf(employeesLeft)) {
                const currentBucketGroup = selectedBucket.getSelectedModel();
                dayElement.innerHTML = sizeOf(currentBucketGroup.userIds) - sizeOf(day.event);
            } else {
                dayElement.innerHTML = sizeOf(day.event);
            }
        }
    }

    valueOf(day.event).onModelAdd(resetCounter)
    valueOf(day.event).onModelRemove(resetCounter)
    onValueChange(employeesLeft)(resetCounter)
    onValueChange(day.status)(resetCounter)
    resetCounter(); // init
}




const styleHoverOnEvent = isHovered => event => {
    if (!event.size()) return; // guard

    const eventOne = event.getAll()[0]; // we only provide planning data for one user
    const dayListCtrl = valueOf(eventOne.days)
    dayListCtrl.forEach(day => setHoverOf(day.event)(isHovered))
}

/**
 * @param dayElement {HTMLElement}
 * @param isMouseDown {Attribute}
 * @param selectionCtrl {SelectionController}
 * @param day {Day}
 */
const setMouseEventListener = (dayElement, isMouseDown,selectionCtrl, day) => {

    dayElement.onmouseleave = _ => {
        if (!valueOf(isMouseDown)) {
            maybe(valueOf(day.event).size() > 0)(() => styleHoverOnEvent(false)(valueOf(day.event)))
            maybe(valueOf(day.holiday))(() => setHoverOf(day.holiday)(false))
        }
    }

    dayElement.onmouseover = _ => { // is triggered before on mouse down
        if (!valueOf(isMouseDown)) {
            maybe(valueOf(day.event).size() > 0)(() => styleHoverOnEvent(true)(valueOf(day.event)))
            maybe(valueOf(day.holiday))(() => setHoverOf(day.holiday)(true))
            return // guard to prevent further steps when no click on day
        }

        selectionCtrl.setSelectedModel(day);
    }

    dayElement.onmousedown = _ => {
        if (day.isDayOff() || !day.isNaturalDay()) return // guard to prevent start of events on day off
        setValueOf(isMouseDown)(true)
        selectionCtrl.setSelectedModel(day);

        addClassNoSelection(document.querySelector("#calendar"))
    }

    dayElement.onmouseup = _ => {
        if (!valueOf(isMouseDown)) return // guard to prevent further steps when no clicked on a day
        setValueOf(isMouseDown)(false)
        selectionCtrl.clearSelection();

        saveClassRemovalNoSelection(document.querySelector("#calendar"))
    }
}
