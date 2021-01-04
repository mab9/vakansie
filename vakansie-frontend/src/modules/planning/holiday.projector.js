import {appendFirst} from "../../assets/util/appends.js";
import {dom} from "../../assets/util/dom.js";
import "../../assets/util/times.js"
import "../../assets/util/dates.js"
import {labelOf, onHoverChange, setHoverOf, valueOf} from "../../base/presentationModel/presentationModel.js";
import {styleElement} from "../../assets/util/cssClasses.js";
import {itCalendarDays} from "../../calendar/calendar.controller.js";
import {creatRowEntries} from "../../service/table.service.js";

export {holidayProjector, pageCss}

const projectorClassName = 'planning-holiday'; // should be unique for this projector

/**
 * @param  rootElement        {HTMLElement}
 * @param  planningCtrl {PlanningController}
 */
const holidayProjector = (rootElement, planningCtrl) => {

    const holidays = dom(`
        <h2> Feiertage </h2>
        <p>Feiertage dieses Jahr: <span>20</span></p>

        <table class="${projectorClassName}-table">
          <tr>
            <th>Feiertag</th>
            <th>Datum</th>
          </tr>
        </table>
    `)

    const table = holidays.querySelector("table")
    const feiertage = holidays.querySelector("span")
    let holidayCounter = 0;
    const calendar = planningCtrl.getCalendarData();

    itCalendarDays(calendar)(day => {
        if (valueOf(day.holiday)) {
            let [holiday, date, row] = creatRowEntries(table);
            holiday.innerText = labelOf(day.holiday);
            date.innerText = valueOf(day.date).getFormated();
            holidayCounter++;

            onHoverChange(day.holiday)(isHovered => {
                styleElement(isHovered)("row-hovering")(row)
            });

            const styleRowOnHover = isHovered => setHoverOf(day.holiday)(isHovered);

            row.onmouseover = _ => styleRowOnHover(true);
            row.onmouseleave = _ => styleRowOnHover(false);
        }
    })

    feiertage.innerText = holidayCounter;
    appendFirst(rootElement)(holidays)
};

const pageCss = `
    button {
         margin-bottom:  0.5em ;
    }

    .${projectorClassName}-table {
        border-collapse: collapse;
        min-width: 400px;
    }

    td, th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
    }

    tr:nth-child(even) {
        background-color: #dddddd;
    }

    .row-hovering {
        border: 5px solid orange !important;
    }
`;
