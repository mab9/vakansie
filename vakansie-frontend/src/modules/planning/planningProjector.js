import {appendFirst} from "../../assets/util/appendFirst.js";
import {dom} from "../../assets/util/dom.js";
import "../../assets/util/times.js"
import {months} from "./planningController.js";
import {Day} from "./planningModel.js";
import {VALUE, valueOf} from "../../base/presentationModel/presentationModel.js";

export {planningProjector, pageCss}

const masterClassName = 'planning-master'; // should be unique for this projector
const detailClassName = 'planning-detail';


/**
 * @param  rootElement        {HTMLElement}
 * @param  planningController {PlanningController}
 */
const planningProjector = (rootElement, planningController) => {

    // 12 X 31 tabelle + headers  zeichnen
    // befüllen mit kalender taben, festtage, sa,so, etc

    //https://dev.to/knheidorn/making-a-calendar-in-vanilla-javascript-48j8

    const planning = dom(`
        <h2> Planning Calendar </h2>
        <button autofocus> + </button>
        <button autofocus> - </button>
        <div id="calendar" class="${masterClassName}-grid-container"></div>
    `)

    const [title, add, remove, calendar] = planning.children;
    //const calendar = planning.querySelector("#calendar");

    const statusAdd = planningController.getStatusAdd();
    add.onclick = () => statusAdd.getObs(VALUE).setValue(true)
    remove.onclick = () => statusAdd.getObs(VALUE).setValue(false)

    // header
    calendar.appendChild(dom(`<div class="cal-header">Month</div>`));
    (31).times((idx) => calendar.appendChild(dom(`<div>${idx + 1}</div>`)))

    // per month
    const data = planningController.getCalendarData();

    data.forEach((month, idx) => {
        calendar.appendChild(dom(`<div class="cal-first" data-i18n="${months[idx]}"></div>`));
        month.forEach(day => dayProjector(calendar, day, planningController))
    })

    appendFirst(rootElement)(planning)
};

const maybe = cond => func => cond ? func() : ""
const saveClassRemoval = element => clazz => maybe(element.classList.contains(clazz))(() => element.classList.remove(clazz));

const addDragged = day => element => isDragged => {
    if (isDragged) {
        element.classList.add("cal-day-dragged")
        setDayOff(day)(true)
    } else {
        saveClassRemoval(element)("cal-day-dragged");
    }
}

const setDayOff = day => off => day.dayoff.getObs(VALUE).setValue(off);


const setEventListener = element => day => planningController => {

    const statusAdd = planningController.getStatusAdd();

    const isMouseDown = planningController.getMouseDown();
    const dragStart = planningController.getDragStart();
    const dragEnd = planningController.getDragEnd();

    dragEnd.onChange(dragEndDay => {
        if (dragEndDay) {
            const start = valueOf(dragStart.getValue().id);
            const end = valueOf(dragEndDay.id);
            const current = valueOf(day.id);

            start < end
                ? addDragged(day)(element)(current >= start && current <= end)
                : addDragged(day)(element)(current <= start && current >= end)

        } else {
            // observable guard will prevent loops
            dragEnd.setValue(undefined)
            addDragged(day)(element)(false)
        }
    })

        // calc only when start day was set (mouse down)
    element.onmouseover = _ => maybe(isMouseDown.getValue())(() => dragEnd.setValue(day))

    element.onmousedown = _ => {
        isMouseDown.setValue(true);
        dragStart.setValue(day);
        dragEnd.setValue(day);
    }

    element.onmouseup = _ => {
        isMouseDown.setValue(false);
        dragStart.setValue(undefined);
        dragEnd.setValue(undefined);
        addDragged(element)(false);
    }

    //element.onclick = _ => setDayOff(day)(!day.dayoff.getObs(VALUE).getValue())
    const holydays = planningController.getHolydays();

    day.dayoff.getObs(VALUE).onChange(isOff => {
        if (isOff) {
            element.classList.add("cal-day-requested-1")
            holydays.setValue(holydays.getValue() - 1);
        } else {
            if (element.classList.contains("cal-day-requested-1")) {
                element.classList.remove("cal-day-requested-1")
                holydays.setValue(holydays.getValue() + 1);
            }
        }
    })
}

/**
 * @param rootElement
 * @param  day {Day}
 * @param  planningController {PlanningController}
 */
const dayProjector = (rootElement, day, planningController) => {

    const html = dom(`<div class="empty"></div>`)
    const element = html.querySelector("div");

    setEventListener(element)(day)(planningController);
    maybe(day.isWeekendDay())(() => element.classList.add("cal-weekend-day"))
    maybe(day.isNotInMonth())(() => element.classList.add("cal-not-in-month"))

    rootElement.appendChild(html)
}

const createColumnAmountString = () => {
    let col = "auto";
    (31).times(_ => {
        col += " auto"
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
        background-color: #618685;
        padding: 2px;
        margin-bottom:  0.5em;
    }
    .${masterClassName}-grid-container > div {
        background-color: #fefbd8;
        border: 2px solid #618685;
        text-align: center;
        min-width: 28px;
        padding: 3px 0;
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
    .cal-day-requested-1 {
        background-color: rgb(192,209,244,0.8) !important;
    }
    .cal-day-dragged {
        background-color: rgb(192,242,244,1) !important;
    }
    .${detailClassName} {
        display:        grid;
        grid-column-gap: 0.5em;
        grid-template-columns: 1fr 3fr;
        margin-bottom:  0.5em ;
    }
`;
