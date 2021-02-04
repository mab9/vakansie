import {
    Attribute,
    labelOf,
    onHoverChange,
    onValueChange,
    setHoverOf,
    setValueOf,
    valueOf
} from "../../vakansie-frontend/src/base/presentationModel/presentationModel.js";
import {maybe} from "../../vakansie-frontend/src/assets/util/maybe.js";
import {
    addClass,
    addClassNoSelection,
    saveClassRemovalNoSelection,
    styleElement
} from "../../vakansie-frontend/src/assets/util/cssClasses.js";
import {dom} from "../../vakansie-frontend/src/assets/util/dom.js";
import {EventStatus} from "../../vakansie-frontend/src/calendar/event.model.js";
import {setTooltip} from "../../vakansie-frontend/src/assets/util/utils.js";
import {appendsStyle} from "../../vakansie-frontend/src/assets/util/appends.js";

export {dayProjector}

const pf = 'crazy-calendar-day'; // should be unique for this projector

/**
 * @param  rootElement {HTMLElement}
 * @param  day {Day}
 * @param  controller {CalendarProjectorCtrl}
 * @param  activateEventCounter {boolean}
 */
const dayProjector = (rootElement, day, controller, activateEventCounter) => {

    const containerElement = dom(`<div class="${pf}-item"></div>`)
    const element = containerElement.querySelector("div");


    element.dataset.dayId = valueOf(day.id);

    const isMouseDown = controller.getMouseDown();
    const selectionCtrl = controller.getSelectionCtrl();


    setDayStyles(element, day);
    setDayHoverListeners(element, day);
    setDayStatusListener(element, day);
    setMouseEventListener(element, isMouseDown, selectionCtrl, day);

    rootElement.appendChild(containerElement)
}

/**
 * @param dayElement {HTMLElement}
 * @param day {Day}
 */
const setDayStyles = (dayElement, day) => {

    onValueChange(day.isSelected)(isSelected => styleElement(isSelected)(`${pf}-dragged`)(dayElement));

    if (valueOf(day.holiday)) {
        addClass(dayElement)(`${pf}-holiday`);
        setTooltip(dayElement)(labelOf(day.holiday));
    }

    styleElement(day.isWeekendDay())(`${pf}-weekend-day`)(dayElement)
    styleElement(!day.isInMonth())(`${pf}-not-in-month`)(dayElement)
}

/**
 * @param dayElement {HTMLElement}
 * @param day {Day}
 */
const setDayStatusListener = (dayElement, day) => {

    const resetDayStyle = () => {

        // reset event status
        for (const status in EventStatus) {
            dayElement.classList.remove(`${pf}-${status.toLowerCase()}`);
        }

        const dayEvent = valueOf(day.event).getAll()[0];

        if (dayEvent) {
            const status = valueOf(dayEvent.status);
            // init day status todo check if this is the right place
            setValueOf(day.status)(status)
            if (status) { // prevent marking of events which go over the weekend or holidays
                styleElement(day.isNaturalDay())(`${pf}-${status.toLowerCase()}`)(dayElement)
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

    const styleDayOnHover = isHovered => styleElement(isHovered)(`${pf}-hovered`)(dayElement)
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
const setMouseEventListener = (dayElement, isMouseDown, selectionCtrl, day) => {

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


appendsStyle(`<style>
         
    /*
       suitable colors, objects, marks to style the day and calendar
       
       different green shadows
       green border
     */
     
    .${pf}-item {
       border-radius: 50%;
       margin: 3px !important;
       /* border: 1px solid var(--c-secondary-0); */
       /*box-shadow: 3px 3px var(--c-primary-3);*/
       box-shadow:  3px 3px 5px #d0d0d0,
            -3px -3px 5px #ffffff;
    }
    
    /* general on hover definition - dark and more saturated
       colors should overwrite this definition to have a cleaner box shadow experience */
    .${pf}-item:hover, .${pf}-hovered {
       /*border: 1px solid var(--c-secondary-1);*/
       filter: saturate(2.2);
       /*box-shadow: 3px 3px var(--c-primary-3);*/
       
       /* shadow is not adaptive to day status color */
       box-shadow: inset 3px 3px 5px #d0d0d0,
           inset -3px -3px 5px #ffffff;
    }
     
    .${pf}-weekend-day {
        background-color: var(--c-calendar-weekend) !important;
    }
    .${pf}-not-in-month {
        background-color: var(--c-primary-3);
    }
    .${pf}-holiday {
        background-color: var(--c-calendar-holiday) !important;
    }
    
    .${pf}-holiday.${pf}-hovered {
        box-shadow: inset 3px 3px 5px #5592cd,
            inset -3px -3px 5px #a2b3d0;
            filter: saturate(1);   
    }
    
    .${pf}-requested {
        background-color: var(--c-calendar-requested) !important;
    }
    
    .${pf}-requested.${pf}-hovered {
        box-shadow: inset 3px 3px 5px #d76e01,
            inset -3px -3px 5px #fd932e;
            filter: saturate(1);   
    }
    
    .${pf}-approved {
        background-color: var(--c-calendar-approved) !important;
    }
        
    .${pf}-rejected {
        background-color: var(--c-calendar-rejected) !important;
    }
    
    .${pf}-rejected.${pf}-hovered {
       box-shadow: inset 3px 3px 5px #e04949,
            inset -3px -3px 5px #fcb3b3;
            filter: saturate(1);     
    }
    
    .${pf}-withdrawn {
        background-color: var(--c-calendar-withdrawn) !important;
    }
    
    .${pf}-dragged {
        background: linear-gradient(
          rgba(192,242,244,0.5),
          rgba(192,242,244,0.5)
        )
    }
    </style>
`);
