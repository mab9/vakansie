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
 * @param  pageController {ApprovalController}  // todo use interface
 * @param  activateEventCounter {boolean}
 */
const dayProjector = (rootElement, day, pageController, activateEventCounter) => {

    const containerElement = dom(`<div></div>`)
    const element = containerElement.querySelector("div");

    const isHoverOnDay = Attribute(false);
    element.onmouseover = _ => setValueOf(isHoverOnDay)(true);
    element.onmouseleave = _ => setValueOf(isHoverOnDay)(false);

    element.dataset.dayId = valueOf(day.id);

    const isMouseDown = pageController.getMouseDown();
    const selectionCtrl = pageController.getSelectionCtrl();

    setMouseEventListener(element, isMouseDown, selectionCtrl, day);
    setDayStyleListener(element, day, isHoverOnDay);
    setDayStatusListener(element, day);

    // is only defined for approval controller
    if (activateEventCounter) {
        setDayEventCounterListener(element, pageController, day);
    }

    rootElement.appendChild(containerElement)
}

/**
 * @param dayElement
 * @param day {Day}
 */
const setDayStatusListener = (dayElement,  day) => {

    const resetDayStyle = () => {

        // reset event status
        dayElement.classList.remove("cal-day-" + EventStatus.APPROVED.toLowerCase());
        dayElement.classList.remove("cal-day-" + EventStatus.REQUESTED.toLowerCase());
        dayElement.classList.remove("cal-day-" + EventStatus.REJECTED.toLowerCase());
        dayElement.classList.remove("cal-day-" + EventStatus.WITHDRAWN.toLowerCase());

        // init day status todo check if this is the right place
        const dayEvent = valueOf(day.event).getAll()[0];

        if (dayEvent) {
            const dayStatus = valueOf(dayEvent.status);
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
 * @param dayElement
 * @param day {Day}
 * @param isHoverOnDay {Attribute}
 */
const setDayStyleListener = (dayElement, day, isHoverOnDay) => {

    onValueChange(day.isSelected)(isSelected => styleElement(isSelected)("cal-day-dragged")(dayElement));

    const styleDayOnHover = isHovered => styleElement(isHovered)("cal-day-hovered")(dayElement)
    onHoverChange(day.event)(isHovered => styleDayOnHover(isHovered));
    onHoverChange(day.id)(isHovered => styleDayOnHover(isHovered));
    onHoverChange(day.holiday)(isHovered => styleDayOnHover(isHovered));

    onValueChange(isHoverOnDay)(isHovered => {
        setHoverOf(day.id)(isHovered);
        setHoverOf(day.event)(isHovered);
        setHoverOf(day.holiday)(isHovered);
    })

    if (valueOf(day.holiday)) {
        addClass(dayElement)("cal-holiday");
        setTooltip(dayElement)(labelOf(day.holiday));
    }

    styleElement(day.isWeekendDay())("cal-weekend-day")(dayElement)
    styleElement(!day.isInMonth())("cal-not-in-month")(dayElement)
}

/**
 * @param dayElement
 * @param pageController {ApprovalController}
 * @param day {Day}
 */
const setDayEventCounterListener = (dayElement, pageController, day) => {

    const employeesLeft = pageController.getEmployeesLeft();
    const groupCtrl = pageController.getGroupCtrl();
    const selectedBucket = groupCtrl.getSelectedBucket()

    const resetCounter = () => {
        if (day.isNaturalDay() && sizeOf(day.event) > 0) {
            if (selectedBucket && valueOf(employeesLeft)) {
                const currentBucketGroup = selectedBucket.getSelectedModel();
                dayElement.innerHTML = sizeOf(currentBucketGroup.userIds) - sizeOf(day.event);
            } else {
                dayElement.innerHTML = sizeOf(day.event);
            }
        } else {
            dayElement.innerHTML = "";
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
    const days = dayListCtrl.getAll();
    days.forEach(day => setHoverOf(day.event)(isHovered))
}

/**
 * @param element {HTMLElement}
 * @param isMouseDown {Attribute}
 * @param selectionCtrl {SelectionController}
 * @param day {Day}
 */
const setMouseEventListener = (element, isMouseDown,selectionCtrl, day) => {

    element.onmouseleave = _ => {
        if (!valueOf(isMouseDown)) {
            maybe(valueOf(day.event).size() > 0)(() => styleHoverOnEvent(false)(valueOf(day.event)))
            maybe(valueOf(day.holiday))(() => setHoverOf(day.holiday)(false))
        }
    }

    element.onmouseover = _ => { // is triggered before on mouse down
        if (!valueOf(isMouseDown)) {
            maybe(valueOf(day.event).size() > 0)(() => styleHoverOnEvent(true)(valueOf(day.event)))
            maybe(valueOf(day.holiday))(() => setHoverOf(day.holiday)(true))
            return // guard to prevent further steps when no click on day
        }

        selectionCtrl.setSelectedModel(day);
    }

    element.onmousedown = _ => {
        if (day.isDayOff() || !day.isNaturalDay()) return // guard to prevent start of events on day off
        setValueOf(isMouseDown)(true)
        selectionCtrl.setSelectedModel(day);

        addClassNoSelection(document.querySelector("#calendar"))
    }

    element.onmouseup = _ => {
        if (!valueOf(isMouseDown)) return // guard to prevent further steps when no clicked on a day
        setValueOf(isMouseDown)(false)
        selectionCtrl.clearSelection();

        saveClassRemovalNoSelection(document.querySelector("#calendar"))
    }
}
