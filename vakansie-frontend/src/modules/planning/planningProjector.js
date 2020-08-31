import {appendFirst} from "../../assets/util/appendFirst.js";
import {dom} from "../../assets/util/dom.js";
import "../../assets/util/times.js"
import {i18n} from "../../service/translationService.js";
import {id} from "../../assets/church/church.js";
import {generateTable} from "../../service/tableService.js";

export {planningProjector, pageCss}

const masterClassName = 'planning-master'; // should be unique for this projector
const detailClassName = 'planning-detail';

const months2 = ["month.jan","month.feb","month.mar","month.apr","month.mai","month.jul",
"month.jun","month.aug","month.sep","month.oct","month.nov","month.dez"];

const months = ["month.jan","month.feb","month.mar","month.apr","month.mai","month.jul"];

const planningProjector = (rootElement) => {

    // 12 X 31 tabelle + headers  zeichnen
    // befüllen mit kalender taben, festtage, sa,so, etc

    //https://dev.to/knheidorn/making-a-calendar-in-vanilla-javascript-48j8

    /*


HEX: #d5f4e6

HEX: #80ced6

HEX: #fefbd8

HEX: #618685
const header = planning.querySelector(".cal-header");
    header.insertAdjacentHTML("afterend", "<div>1</div>");
    header.insertAdjacentHTML("afterend", "<div>2</div>");
     */

    const planning = dom(`
        <h2> Planning Calendar </h2>
        <div id="calendar" class="${masterClassName}-grid-container">
        </div>
    `)

    const today = new Date();


    const isDayOff = year => month => day => {
        const value = new Date(year, month, day).getDay();
        return value === 0 || value === 6;
    }

    const isNotInMonth = year => month => day => {
        const value = new Date(year, month, day).getMonth();
        return month !== value;
    }

    const calendar = planning.querySelector("#calendar");

    // header
    calendar.appendChild(dom(`<div class="cal-header">Month</div>`));
    (31).times((idx) => calendar.appendChild(dom(`<div>${idx + 1}</div>`)))


    // per month
    months.forEach(month => {
        const yyyy = today.getFullYear();
        const mm = months.indexOf(month);

        calendar.appendChild(dom(`<div class="cal-first" data-i18n="${month}">d</div>`));
        (31).times((idx) => {
            const dayOff = isDayOff(yyyy)(mm)(idx + 1) ? " cal-day-off" : "";
            const notInMonth = isNotInMonth(yyyy)(mm)(idx + 1) ? " cal-not-in-month" : "";
            const day = dom(`<div class="${dayOff}${notInMonth}"></div>`)
            calendar.appendChild(day)
        })
    })

    appendFirst(rootElement)(planning)
};

const createColumnAmountString = () => {
    let col = "auto";
    (31).times((idx) => {col += " auto"})
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
        padding: 3px 0;
        font-size: 15px;
    }
    .cal-header, .cal-first {
        font-weight: bold;
    }
    .cal-day-off {
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
