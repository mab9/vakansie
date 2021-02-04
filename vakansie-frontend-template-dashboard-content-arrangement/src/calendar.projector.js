import {dom} from "../../vakansie-frontend/src/assets/util/dom.js";
import "../../vakansie-frontend/src/assets/util/times.js"
import "../../vakansie-frontend/src/assets/util/dates.js"
import {months} from "../../vakansie-frontend/src/calendar/calendar.service.local.js";
import {dayProjector} from "./day.projector.js";
import {appendsStyle} from "../../vakansie-frontend/src/assets/util/appends.js";

export {calendarProjector}

const pf = 'crazy-calendar'; // should be unique for this projector

/**
 * @param  rootElement {HTMLElement}
 * @param  controller {CalendarProjectorCtrl}
 * @param  activateEventCounter {boolean} // only approval controller is able to use this boolean. rework?
 */
const calendarProjector = (rootElement, controller, activateEventCounter) => {


    rootElement.classList.add(`${pf}-grid-container`);

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


appendsStyle(`<style>

    .${pf}-grid-container {
        display: grid;
        grid-template-columns: 120px repeat(31, minmax(27px, auto));
        align-items: center;
        max-width: 1200px;
    }
    
    .${pf}-grid-container > div {
        min-width: 27px;
        min-height: 27px;
        font-size: 12px;
    }
    
    .${pf}-grid-container > div:first-child {
        text-align: left !important;
    }
    
    .cal-header {
        border-bottom: 1px solid var(--c-secondary-1) !important;
        margin-bottom: 8px;
        text-align: center;
    }

    .cal-header, .cal-first {
        font-weight: bold;
    }

    </style>
`);
