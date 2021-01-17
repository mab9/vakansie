import {dom} from "../assets/util/dom.js";
import "../assets/util/times.js"
import "../assets/util/dates.js"
import {months} from "./calendar.service.local.js";
import {dayProjector} from "./day.projector.js";

export {calendarProjector, pageCss}

const detailClassName = 'approval-detail'; // should be unique for this projector

/**
 * @param  rootElement {HTMLElement}
 * @param  controller {ApprovalController} // todo use interface
 * @param  activateEventCounter {boolean} // only approval controller is able to use this boolean. rework?
 */
const calendarProjector = (rootElement, controller, activateEventCounter) => {

    const addHeader = () => {
        rootElement.appendChild(dom(`<div class="cal-header">Month</div>`));
        (31).times((idx) => rootElement.appendChild(dom(`<div class="cal-header">${idx + 1}</div>`)));
    }

    const addMonth = month => idx => {
        rootElement.appendChild(dom(`<div class="cal-first" data-i18n="${months[idx]}"></div>`));
        month.forEach(day => dayProjector(rootElement, day, controller, activateEventCounter))
    }

    const displayYear = () => {
        controller.getCalendarData().forEach((month, idx) => addMonth(month)(idx))
    }

    addHeader();
    displayYear(); // default
};



const pageCss = `
    button {
         margin-bottom:  0.5em ;
    }

    .${detailClassName}-grid-container {
        display: grid;
        grid-template-columns: 120px repeat(31, 27px);
        padding: 2px;
        margin-bottom:  0.5em;
    }
    .${detailClassName}-grid-container > div {
        border: 1px solid #618685;
        text-align: center;
        min-width: 27px;
        min-height: 27px;
        padding: 3px 0;
        font-size: 15px;
    }

    .${detailClassName}-grid-container > div:hover {
        border: 0;
        padding: 0 0;
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
        background-color: rgb(224,224,224,1) !important;
    }
    .cal-holiday {
        background-color: rgb(128,175,214,1) !important;
    }
    .cal-day-requested {
        background-color: rgb(255,128,0,0.8) !important;
    }
    .cal-day-approved {
        background-color: rgb(153,255,89,1) !important;
    }
    .cal-day-rejected {
        background-color: rgb(225,0,0,1) !important;
    }
    .cal-day-withdrawn {
        background-color: rgb(192,209,244,1) !important;
    }
    .cal-day-hovered {
        border-top: 4px solid orange !important;
        border-bottom: 4px solid orange !important;
        padding: 0 !important;
    }

    .cal-day-dragged {
        background: linear-gradient(
          rgba(192,242,244,0.5),
          rgba(192,242,244,0.5)
        )
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
