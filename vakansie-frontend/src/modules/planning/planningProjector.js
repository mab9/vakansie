import {appendFirst, appendReplacing} from "../../assets/util/appendFirst.js";
import {dom} from "../../assets/util/dom.js";
import "../../assets/util/times.js"
import {months} from "./planningController.js";
import {Day} from "./planningModel.js";
import {VALUE, LABEL, SELECTED, valueOf, Attribute} from "../../base/presentationModel/presentationModel.js";
import "../../assets/util/dates.js"

export {planningProjector, pageCss}

const masterClassName = 'planning-master'; // should be unique for this projector
const detailClassName = 'planning-detail';

/**
 * @param  rootElement        {HTMLElement}
 * @param  planningController {PlanningController}
 */
const planningProjector = (rootElement, planningController) => {

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
    planningController.getCalendarData().forEach((month, idx) => {
        calendar.appendChild(dom(`<div class="cal-first" data-i18n="${months[idx]}"></div>`));
        month.forEach(day => dayProjector(calendar, day, planningController))
    })

    appendFirst(rootElement)(planning)
};


// todo add to utils
const maybe = cond => func => cond ? func() : ""
const saveClassRemoval = element => clazz => maybe(element.classList.contains(clazz))(() => element.classList.remove(clazz));
const saveClassRemoval2 = elements => clazz => {
    for (let i = 0; i < elements.length; i++) {
        saveClassRemoval(elements[i])(clazz)
    }
}
const addClass = element => clazz => element.classList.add(clazz);
const addClass2 = elements => clazz => {  // todo rewrite addClass so that it takes one or multiple elements
    for (let i = 0; i < elements.length; i++) {
        addClass(elements[i])(clazz)
    }
}

const setSelected = day => isDragged => day.date.getObs(SELECTED).setValue(isDragged);

const isDayBetweenStartAndCurrentSelection = selectedDay => day => planningCtrl => {
    if (!selectedDay) return;

    const fromTo = planningCtrl.getCurrentFromTo();

    const from    = valueOf(valueOf(fromTo.from).id);
    const to      = valueOf(valueOf(fromTo.to).id);
    const dayValue = valueOf(day.id);

    return from <= dayValue && to >= dayValue;
}

const setDayOff = day => off => day.dayoff.getObs(VALUE).setValue(off);

/**
 * @param element
 * @param day {Day}
 * @param planningController {PlanningController}
 */
const setEventListener = (element, day, planningController) => {

    const isMouseDown = planningController.getMouseDown();
    const selectionCtrl = planningController.getSelectionController();
    const holydays = planningController.getHolyDays();

    // todo start end observables im from to list controller stopfen.

    // behavior when a day is currently selected - pay attention: is execute for each day!
    selectionCtrl.onModelSelected(selectedDay => {
        let selected = Boolean(valueOf(selectedDay.date) && isDayBetweenStartAndCurrentSelection(selectedDay)(day)(planningController));
        setSelected(day)(selected);
    })

    day.date.getObs(SELECTED).onChange(isSelected => {
        if (isSelected) {
            if (day.isBookable()) {
                element.classList.add("cal-day-dragged")
                setDayOff(day)(true)
            }
        } else {
            saveClassRemoval(element)("cal-day-dragged");
            if (isMouseDown.getObs(VALUE).getValue()) {
                setDayOff(day)(false)
            }
        }
    })

    day.dayoff.getObs(VALUE).onChange(isOff => {
        if (isOff) {
            element.classList.add("cal-day-requested-1")
            holydays.getObs(VALUE).setValue(holydays.getObs(VALUE).getValue() - 1);
        } else {
            saveClassRemoval(element)("cal-day-requested-1");
            holydays.getObs(VALUE).setValue(holydays.getObs(VALUE).getValue() + 1);
        }
    })

    // calc only when start day was set (mouse down)
    element.onmouseover = _ => maybe(isMouseDown.getObs(VALUE).getValue())(() => selectionCtrl.setSelectedModel(day))

    element.onmousedown = _ => {
        // pay attention: is execute for each day!
        const headers = document.getElementsByClassName("cal-header");
        const firsts = document.getElementsByClassName("cal-first");

        // todo check if we add to each html a no selection
        addClass2(headers)("no-selection")
        addClass2(firsts)("no-selection")
        isMouseDown.getObs(VALUE).setValue(true);
        selectionCtrl.setSelectedModel(day);
    }

    element.onmouseup = _ => {
        // pay attention: is execute for each day!
        const headers = document.getElementsByClassName("cal-header");
        const firsts = document.getElementsByClassName("cal-first");

        // todo check if we add to each html a no selection
        saveClassRemoval2(headers)("no-selection")
        saveClassRemoval2(firsts)("no-selection")

        isMouseDown.getObs(VALUE).setValue(false);
        selectionCtrl.clearSelection();
    }
}

const setTooltip = element => text => element.setAttribute("title", text);

/**
 * @param rootElement
 * @param  day {Day}
 * @param  planningController {PlanningController}
 */
const dayProjector = (rootElement, day, planningController) => {

    const html = dom(`<div class="empty"></div>`)
    const element = html.querySelector("div");

    setEventListener(element, day, planningController);
    maybe(day.isWeekendDay())(() => element.classList.add("cal-weekend-day"))
    maybe(day.isNotInMonth())(() => element.classList.add("cal-not-in-month"))
    maybe(day.holyday.getObs(VALUE).getValue())(() => element.classList.add("cal-holyday"))
    maybe(day.holyday.getObs(VALUE).getValue())(() => setTooltip(element)(day.holyday.getObs(LABEL).getValue()))
    rootElement.appendChild(html)
}


const createColumnAmountString = () => {
    let col = "120px";
    (31).times(_ => {
        col += " 27px"
    })
    return col;
}

createColumnAmountString()

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

    .${detailClassName}-grid-container {
        min-width: 120px;
        display: grid;
        /*grid-gap: 0.2em;*/
        grid-template-columns: 120px 120px 60px 60px;
        padding: 2px;
        margin-bottom:  0.5em;
    }
    .${detailClassName}-grid-container > div {
        border-bottom: 2px solid #618685;
        text-align: center;
        font-size: 15px;
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
    .cal-holyday {
        background-color: rgb(128,175,214,1) !important;
    }
    .cal-day-requested-1 {
        background-color: rgb(192,209,244,0.8) !important;
    }
    .cal-day-dragged {
        background-color: rgb(192,242,244,1) !important;
    }
`;
