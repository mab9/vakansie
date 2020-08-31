import {appendFirst} from "../../assets/util/appendFirst.js";
import {dom} from "../../assets/util/dom.js";
import "../../assets/util/times.js"
import {months} from "./planningController.js";
import {Day} from "./planningModel.js";

export {planningProjector, pageCss}

const masterClassName = 'planning-master'; // should be unique for this projector
const detailClassName = 'planning-detail';

/** @param day {Day} */
const isWeekendDay = day => day.date.getDay() === 0 || day.date.getDay() === 6;

/** @param day {Day} */
const isNotInMonth = day => day.date.getDate() !== day.day

const planningProjector = (rootElement, planningController) => {

    // 12 X 31 tabelle + headers  zeichnen
    // befüllen mit kalender taben, festtage, sa,so, etc

    //https://dev.to/knheidorn/making-a-calendar-in-vanilla-javascript-48j8

    /*


HEX: #d5f4e6

HEX: #80ced6

HEX: #fefbd8

HEX: #618685
*/
    const planning = dom(`
        <h2> Planning Calendar </h2>
        <div id="calendar" class="${masterClassName}-grid-container">
        </div>
    `)

    const calendar = planning.querySelector("#calendar");

    const myFunction = action => console.info("mouse was ", action)

    const isMouseDown = true;
    calendar.onmousedown = _ => myFunction('cdown')
    calendar.onmouseup = _ => myFunction('cup')
    calendar.onclick = _ => myFunction('cclick')
    calendar.onmouseover = _ => myFunction('cover')

    // header
    calendar.appendChild(dom(`<div class="cal-header">Month</div>`));
    (31).times((idx) => calendar.appendChild(dom(`<div>${idx + 1}</div>`)))

    // per month
    const data = planningController.getCalendarData();

    data.forEach((month, idx) => {
        const yyyy = new Date().getFullYear();
        const mm = idx;

        calendar.appendChild(dom(`<div class="cal-first" data-i18n="${months[idx]}"></div>`));
        month.forEach((day, idx) => {
            dayProjector(calendar, yyyy, mm, day, idx)

        })
    })

    appendFirst(rootElement)(planning)
};


const maybe = cond => func => {
    if (cond) { func() }
}

/** @param {Day} day */
const dayProjector = (rootElement, yyyy, mm, day, idx) => {

    const html = dom(`<div class="empty"></div>`)
    const element = html.querySelector("div");

    element.onMouseDown = _ => myFunction('down')
    element.onMouseUp = _ => myFunction('up')
    element.onclick = _ => day.dayoff.setValue(!day.dayoff.getValue());

    maybe(isWeekendDay(day))(() => element.classList.add("cal-weekend-day"))
    maybe(isNotInMonth(day))(() => element.classList.add("cal-not-in-month"))



    rootElement.appendChild(html)
}

const createColumnAmountString = () => {
    let col = "auto";
    (31).times((idx) => {
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
        background-color: #80ced6 !important;
    }
    .cal-not-in-month {
        background-color: #d5f4e6 !important;
     }
    .${detailClassName} {
        display:        grid;
        grid-column-gap: 0.5em;
        grid-template-columns: 1fr 3fr;
        margin-bottom:  0.5em ;
    }
`;
