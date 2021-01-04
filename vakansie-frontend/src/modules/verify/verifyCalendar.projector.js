import {appendFirst} from "../../assets/util/appends.js";
import {dom} from "../../assets/util/dom.js";
import "../../assets/util/times.js"
import {Day} from "../../calendar/day.model.js";
import {labelOf, valueOf} from "../../base/presentationModel/presentationModel.js";
import "../../assets/util/dates.js"
import {maybe} from "../../assets/util/maybe.js";
import {addClass, styleElement} from "../../assets/util/cssClasses.js";
import {months} from "../../calendar/calendar.service.local.js";

export {verifyCalendarProjector, pageCss}

const detailClassName = 'verify-detail'; // should be unique for this projector

/**
 * @param  rootElement {HTMLElement}
 * @param  verifyCtrl {VerifyController}
 */
const verifyCalendarProjector = (rootElement, verifyCtrl) => {

    const planning = dom(`
        <h2> Verify Calendar </h2>
        <nav>
            <div id="marker"></div>
            <a href="#">Year</a>
            <a href="#">Month</a>
        </nav>

        <div id="calendar" class="${detailClassName}-grid-container"></div>
    `)

    /* calendar navigation */
    const marker = planning.querySelector("nav #marker");
    const anchors = planning.querySelectorAll("nav a");

    const indicator = evt => {
        marker.style.left = evt.target.offsetLeft + "px";
        marker.style.width = evt.target.offsetWidth + "px";
    }

    anchors.forEach(anchor => anchor.addEventListener("click", indicator))

    const year = anchors[0];
    const month = anchors[1];


    const calendar = planning.querySelector("#calendar");

    const cleanUpCalendar = () => {
        while (calendar.firstChild) calendar.removeChild(calendar.lastChild);
    }

    const addHeader = () => {
        calendar.appendChild(dom(`<div class="cal-header">Month</div>`));
        (31).times((idx) => calendar.appendChild(dom(`<div class="cal-header">${idx + 1}</div>`)));
    }

    const addMonth = month => idx => {
        calendar.appendChild(dom(`<div class="cal-first" data-i18n="${months[idx]}"></div>`));
        month.forEach(day => dayProjector(calendar, day, verifyCtrl))
    }

    const displayYear = () => {
        verifyCtrl.getCalendarData().forEach((month, idx) => addMonth(month)(idx))
    }

    const displayMonth = () => {
        verifyCtrl.getCalendarData().forEach((month, idx) => {
            maybe(idx === new Date().getMonth())(() => addMonth(month)(idx))
        })
    }

    year.onclick = _ => {
        cleanUpCalendar();
        addHeader();
        displayYear();
    }
    month.onclick = _ => {
        cleanUpCalendar();
        addHeader()
        displayMonth();
    }

    addHeader();
    displayYear(); // default
    // todo add anchor year default

    appendFirst(rootElement)(planning)
};

/**
 * @param  rootElement {HTMLElement}
 * @param  day {Day}
 * @param  verifyCtrl {VerifyController}
 */
const dayProjector = (rootElement, day, verifyCtrl) => {

    const html = dom(`<div></div>`)
    const element = html.querySelector("div");

    element.dataset.dayId = valueOf(day.id);

    styleElement(day.isNaturalDay() && valueOf(day.event) && valueOf(valueOf(day.event).approved))("cal-day-approved")(element)
    styleElement(day.isWeekendDay())("cal-weekend-day")(element)
    styleElement(!day.isInMonth())("cal-not-in-month")(element)

    maybe(valueOf(day.holiday))(() => {
        addClass(element)("cal-holiday");
        setTooltip(element)(labelOf(day.holiday));
    })
    rootElement.appendChild(html)
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

    .${detailClassName}-grid-container {
        display: grid;
        /*grid-gap: 0.2em;*/
        grid-template-columns: ${createColumnAmountString()};
        /*background-color: #618685;*/
        padding: 2px;
        margin-bottom:  0.5em;
    }
    .${detailClassName}-grid-container > div {
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
        background-color: rgb(162,229,157,1) !important;
    }
    .cal-holiday {
        background-color: rgb(128,175,214,1) !important;
    }
    .cal-day-requested {
        background-color: rgb(192,209,244,0.8) !important;
    }
    .cal-day-approved {
        background-color: rgb(225,255,0,1) !important;
    }
    .cal-day-hovered {
        border-top: 7px solid black !important;
        border-bottom: 7px solid black !important;
    }
    .cal-day-dragged {
        background-color: rgb(192,242,244,1) !important;
    }

    /* wird benötigt, damit der marker gesetzt werden kann */
    nav {
        position: relative;
    }
    nav a {
        margin: 0 1em 0 0 ;
        font-family: "Helvetica Neue", "sans-serif";
        font-size: larger;
        color: darkblue;
        text-decoration: none;
        text-transform: uppercase;
    }
    nav #marker {
        position: absolute;
        left: 0;
        width: 0;
        background: darkmagenta;
        height: .2em;
        bottom: -0.2em;
        transition: all linear .3s ;
    }
`;