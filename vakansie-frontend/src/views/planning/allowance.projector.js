import {appendReplacing} from "../../assets/util/appends.js";
import {dom} from "../../assets/util/dom.js";
import "../../assets/util/times.js"
import {forEach, HOVER, onValueChange, valueOf} from "../../base/presentationModel/presentationModel.js";
import "../../assets/util/dates.js"
import {styleElement} from "../../assets/util/cssClasses.js";
import {creatRowEntries} from "../../service/table.service.js";

export {allowanceProjector, pageCss}

const detailClassName = 'planning-detail';

/**
 * @param  rootElement        {HTMLElement}
 * @param  planningCtrl {PlanningController}
 */
const allowanceProjector = (rootElement, planningCtrl) => {
    const vacationContigent = planningCtrl.getVacationContigent();
    const currentVacationContigent = planningCtrl.getCurrentVacationContigent();
    const eventListCtrl = planningCtrl.getEventListCtrl();

    const planning = dom(`
        <h2> Details Ferienkontingent</h2>
        <p>Ferientage dieses Jahr: <span>20</span></p>
        <p>Ferientage gebucht: <span>0</span></p>
        <p>Ferientage verbleibend: <span>0</span></p>

        <!-- todo create fancy table generator analogue angular -->
        <table class="${detailClassName}-table">
          <tr>
            <th>from</th>
            <th>to</th>
            <th>days</th>
            <th>delete</th>
            <th>status</th>
          </tr>
        </table>
    `)

    const span = planning.querySelectorAll("span")
    const vacationContigentThisYear = span[0];
    const vacationBoockedThisYear = span[1];
    const vacationLeftThisYear = span[2];

    onValueChange(vacationContigent)(value => vacationContigentThisYear.innerText = value)
    onValueChange(currentVacationContigent)(value => {
        vacationBoockedThisYear.innerText = value
        vacationLeftThisYear.innerText = valueOf(vacationContigent) - valueOf(currentVacationContigent);
    });

    const table = planning.querySelector("table")

    const updateDaysBetween = days => event => {
        days.textContent = valueOf(valueOf(event.from).date).countDaysBetween(valueOf(valueOf(event.to).date)) + 1;
    }

    const deleteRow = event =>{
        table.querySelector(`[data-event-id="` + valueOf(event.id) + `"]`).remove();
    }

    /** @event event {Event} */
    const processEvent = event => {
        let [start, end, days, remove, status, row] = creatRowEntries(table);

        row.dataset.eventId = valueOf(event.id);
        start.textContent = valueOf(valueOf(event.from).date).getFormatted();
        end.textContent = valueOf(valueOf(event.to).date).getFormatted();

        onValueChange(event.from)(day => {
            start.textContent = valueOf(day.date).getFormatted();
            updateDaysBetween(days)(event)
        });

        onValueChange(event.to)(day => {
            end.textContent = valueOf(day.date).getFormatted();
            updateDaysBetween(days)(event)
        });

        updateDaysBetween(days)(event) // init

        onValueChange(event.status)(value => styleElement(value)("status-" + valueOf(event.status).toLowerCase())(status.parentElement));
        styleElement(valueOf(event.status))("status-" + valueOf(event.status).toLowerCase())(status.parentElement);

        remove.appendChild(dom('<input type="button" value="X"></div>'))
        const removeBtn = remove.querySelector("input");
        removeBtn.onclick = _ => {
            planningCtrl.deleteEvent(event);
            deleteRow(event);
        }

        forEach(event.days)(day => {
            day.event.getObs(HOVER).onChange(isHovered => {
                styleElement(isHovered)("row-hovering")(row)
            });
        })

        const styleRowOnHover = isHovered => {
            forEach(event.days)(day => {
                day.event.getObs(HOVER).setValue(isHovered);
            })
        }


        row.onmouseover = _ => styleRowOnHover(true);
        row.onmouseleave = _ => styleRowOnHover(false);
    }


    eventListCtrl.getAll().forEach(event => processEvent(event));
    eventListCtrl.onModelAdd(event => processEvent(event));

    appendReplacing(rootElement)(planning);
}


const pageCss = `
    button {
         margin-bottom:  0.5em ;
    }

    .${detailClassName}-table {
        border-collapse: collapse;
        min-width: 400px;
    }

    .no-selection {
        border: 1px solid yellow;
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

    .status-requested {
        background-color: rgb(255,128,0,0.8) !important;
    }
    .status-approved {
        background-color: rgb(153,255,89,1) !important;
    }
    .status-rejected {
        background-color: rgb(225,0,0,1) !important;
    }
    .status-withdrawn {
        background-color: rgb(192,209,244,1) !important;
    }
`;