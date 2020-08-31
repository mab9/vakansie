import {appendFirst} from "../../assets/util/appendFirst.js";
import {dom} from "../../assets/util/dom.js";
import "../../assets/util/times.js"
import {months} from "./planningController.js";
import {Day} from "./planningModel.js";
import {VALUE, valueOf} from "../../base/presentationModel/presentationModel.js";

export {planningProjector, pageCss}

const masterClassName = 'planning-master'; // should be unique for this projector
const detailClassName = 'planning-detail';

/** @param day {Day} */
const isWeekendDay = day => valueOf(day.date).getDay() === 0 || valueOf(day.date).getDay() === 6;

/** @param day {Day} */
const isNotInMonth = day => valueOf(day.date).getDate() !== valueOf(day.day);

const planningProjector = (rootElement, planningController) => {

    // 12 X 31 tabelle + headers  zeichnen
    // befüllen mit kalender taben, festtage, sa,so, etc

    //https://dev.to/knheidorn/making-a-calendar-in-vanilla-javascript-48j8

    const planning = dom(`
        <h2> Planning Calendar </h2>
        <div id="calendar" class="${masterClassName}-grid-container">
        </div>
    `)

    const calendar = planning.querySelector("#calendar");

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

const addDragged = element => isDragged => {
    isDragged
        ? element.classList.add("cal-day-dragged")
        : element.classList.contains("cal-day-dragged")
            ? element.classList.remove("cal-day-dragged") : "";
}

/**
 * @param rootElement
 * @param  day {Day}
 * @param  planningController {PlanningController}
 */
const dayProjector = (rootElement, day, planningController) => {

    const html = dom(`<div class="empty"></div>`)
    const element = html.querySelector("div");

    const isMouseDown = planningController.getMouseDown();
    const dragStart = planningController.getDragStart();
    const dragEnd = planningController.getDragEnd();


    dragEnd.onChange(dragEndDay => {
        if (dragEndDay) {
            const startValue = dragStart.getValue().id.getObs(VALUE).getValue()
            const currentValue = valueOf(dragEndDay.id)
            if (startValue < currentValue) {
                const val = valueOf(day.id);
                if (val >= startValue && val <= currentValue) {
                    addDragged(element)(true)
                } else {
                    addDragged(element)(false)
                }
            } else {
                const val = valueOf(day.id);
                if (val <= startValue && val >= currentValue) {
                    addDragged(element)(true)
                } else {
                    addDragged(element)(false)
                }
            }
        }
    })

    element.onmouseover = _ => {
        // calc only when start day was set (mouse down)
        if (isMouseDown.getValue()) {
            const startValue = dragStart.getValue().id.getObs(VALUE).getValue()
            const currentValue = valueOf(day.id)
            dragEnd.setValue(day);
            console.info("from: " + startValue + " until " + currentValue);
        }
    }
    element.onmousedown = _ => {
        isMouseDown.setValue(true);
        dragStart.setValue(day);
        dragEnd.setValue(day);
    }
    element.onmouseup = _ => {
        isMouseDown.setValue(false);
        dragStart.setValue(undefined);
        dragEnd.setValue(undefined);
    }
    element.onclick = _ => day.dayoff.getObs(VALUE).setValue(!day.dayoff.getObs(VALUE).getValue());

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

    maybe(isWeekendDay(day))(() => element.classList.add("cal-weekend-day"))
    maybe(isNotInMonth(day))(() => element.classList.add("cal-not-in-month"))

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
    .${masterClassName}-grid-container {
        display: grid;
        grid-gap: 0.2em;
        grid-template-columns: ${createColumnAmountString()};
        background-color: #618685;
        padding: 5px;
        margin-bottom:  0.5em;
    }
    .${masterClassName}-grid-container > div {
        background-color: #fefbd8;
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
