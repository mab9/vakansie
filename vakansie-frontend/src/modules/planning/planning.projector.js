import {appendFirst} from "../../assets/util/appends.js";
import {dom} from "../../assets/util/dom.js";
import "../../assets/util/times.js"
import {months} from "../../calendar/calendar.service.local.js";
import {Day} from "../../calendar/day.model.js";
import {HOVER, labelOf, onValueChange, setValueOf, valueOf} from "../../base/presentationModel/presentationModel.js";
import "../../assets/util/dates.js"
import {maybe} from "../../assets/util/maybe.js";
import {styleElement} from "../../assets/util/cssClasses.js";

export {planningProjector, pageCss}

const masterClassName = 'planning-master'; // should be unique for this projector

/**
 * @param  rootElement        {HTMLElement}
 * @param  planningCtrl {PlanningController}
 */
const planningProjector = (rootElement, planningCtrl) => {

    //https://dev.to/knheidorn/making-a-calendar-in-vanilla-javascript-48j8

    const planning = dom(`
        <h2> Planning Calendar </h2>
        <div id="calendar" class="${masterClassName}-grid-container"></div>
    `)

    const calendar = planning.querySelector("#calendar");

    // header
    calendar.appendChild(dom(`<div class="cal-header">Month</div>`));
    (31).times((idx) => calendar.appendChild(dom(`<div class="cal-header">${idx + 1}</div>`)))

    // per month
    planningCtrl.getCalendarData().forEach((month, idx) => {
        calendar.appendChild(dom(`<div class="cal-first" data-i18n="${months[idx]}"></div>`));
        month.forEach(day => dayProjector(calendar, day, planningCtrl))
    })

    appendFirst(rootElement)(planning)
};

/**
 * @param  rootElement {HTMLElement}
 * @param  day {Day}
 * @param  planningCtrl {PlanningController}
 */
const dayProjector = (rootElement, day, planningCtrl) => {

    const html = dom(`<div class="empty"></div>`)
    const element = html.querySelector("div");

    element.dataset.dayId = valueOf(day.id);

    setMouseEventListener(element, planningCtrl);
    setDayEventListener(element, planningCtrl);
    maybe(day.isWeekendDay())(() => element.classList.add("cal-weekend-day"))
    maybe(!day.isInMonth())(() => element.classList.add("cal-not-in-month"))
    maybe(valueOf(day.holiday))(() => {
        element.classList.add("cal-holiday");
        setTooltip(element)(labelOf(day.holiday));
    })
    rootElement.appendChild(html)
}


const styleHover = isHovered => event => {
    const dayListCtrl = valueOf(event.days)
    const days = dayListCtrl.getAll();
    days.forEach(day => {
        day.event.getObs(HOVER).setValue(isHovered);
    })
}

/**
 * @param element {HTMLElement}
 * @param planningCtrl {PlanningController}
 */
const setMouseEventListener = (element, planningCtrl) => {

    const isMouseDown = planningCtrl.getMouseDown();

    const getDayByElement = element => planningCtrl.getDayById(element.dataset.dayId);
    const day = getDayByElement(element);

    element.onmouseleave = _ => {
        if (!valueOf(isMouseDown)) {
            maybe(valueOf(day.event))(() => styleHover(false)(valueOf(day.event)))
        }
    }

    element.onmouseover = _ => { // is triggered before on mouse down
        if (!valueOf(isMouseDown)) {
            maybe(valueOf(day.event))(() => styleHover(true)(valueOf(day.event)))
            return // guard to prevent further steps when no click on day
        }

        // guard to prevent events on day off
        if (day.isNaturalDay() && !day.isBookable()) {  // todo end / reset as well if selection does overlaps events by selection an other row
            setValueOf(isMouseDown)(false)
            planningCtrl.endEvent();
        }

        setValueOf(day.isSelected)(true)
        planningCtrl.updateEvent(day)
    }

    element.onmousedown = _ => {
        if (day.isDayOff() || !day.isNaturalDay()) return // guard to prevent start of events on day off
        setValueOf(isMouseDown)(true)
        console.info("onmouse down - go one")
        //const headers = document.getElementsByClassName("cal-header");
        //const firsts = document.getElementsByClassName("cal-first");
//
        //addClass(headers)("no-selection")
        //addClass(firsts)("no-selection")
        setValueOf(day.isSelected)(true)
        planningCtrl.createEvent(day);
    }

    element.onmouseup = _ => {
        if (!valueOf(isMouseDown)) return // guard to prevent further steps when no clicked on a day
        console.info("onmouse up - go one")
        //const headers = document.getElementsByClassName("cal-header");
        //const firsts = document.getElementsByClassName("cal-first");
//
        //saveClassRemoval(headers)("no-selection")
        //saveClassRemoval(firsts)("no-selection")
        setValueOf(isMouseDown)(false)
        planningCtrl.endEvent();
    }
}


/**
 * @param element
 * @param planningCtrl {PlanningController}
 */
const setDayEventListener = (element, planningCtrl) => {

    const getDayByElement = element => planningCtrl.getDayById(element.dataset.dayId);
    const day = getDayByElement(element);

    day.event.getObs(HOVER).onChange(isHovered => styleElement(isHovered && day.isNaturalDay())("cal-day-dragged")(element));
    onValueChange(day.isSelected)(isSelected => styleElement(isSelected && day.isBookable())("cal-day-dragged")(element));
    onValueChange(day.event)(event => styleElement(event && day.isNaturalDay())("cal-day-requested-1")(element));
}


const setTooltip = element => text => element.setAttribute("title", text);

const createColumnAmountString = () => {
    let col = "120px";
    (31).times(_ => {
        col += " 27px"
    })
    return col;
}


const pageCss = `
    button {
         margin-bottom:  0.5em ;
    }

    .${masterClassName}-grid-container {
        display: grid;
        /*grid-gap: 0.2em;*/
        grid-template-columns: ${createColumnAmountString()};
        /*background-color: #618685;*/
        padding: 2px;
        margin-bottom:  0.5em;
    }
    .${masterClassName}-grid-container > div {
        /*background-color: #fefbd8;*/
        border: 1px solid #618685;
        text-align: center;
        min-width: 27px;
        padding: 3px 0;
        font-size: 15px;
    }

    .no-selection {
        user-select: none;
    }

    .cal-header, .cal-first {
        font-weight: bold;
    }
    .cal-weekend-day {
        background-color: rgb(128,206,214,1) !important;
    }
    .cal-not-in-month {
        background-color: rgb(192,209,244,1) !important;
    }
    .cal-holiday {
        background-color: rgb(128,175,214,1) !important;
    }
    .cal-day-requested-1 {
        background-color: rgb(192,209,244,0.8) !important;
    }
    .cal-day-dragged {
        background-color: rgb(192,242,244,1) !important;
    }
`;
