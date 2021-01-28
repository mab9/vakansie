import {appendReplacing} from "../../assets/util/appends.js";
import {dom} from "../../assets/util/dom.js";
import "../../assets/util/times.js"
import {
    forEach,
    onHoverChange,
    onValueChange,
    setHoverOf,
    valueOf
} from "../../base/presentationModel/presentationModel.js";
import "../../assets/util/dates.js"
import {styleElement} from "../../assets/util/cssClasses.js";
import {addRowHovering, creatRowEntries} from "../../service/table.service.js";
import {tableProjector} from "./table.projector.js";

export {allowanceProjector, pageCss}

const detailClassName = 'planning-detail';

/**
 * @param  rootElement        {HTMLElement}
 * @param  planningCtrl {PlanningController}
 */
const allowanceProjector = (rootElement, planningCtrl) => {
    const vacationContigent = planningCtrl.getVacationContigent();
    const currentVacationContigent = planningCtrl.getCurrentVacationContigent();

    const planning = dom(`
        <h2> Details Ferienkontingent</h2>
        <p>Ferientage dieses Jahr: <span>20</span></p>
        <p>Ferientage gebucht: <span>0</span></p>
        <p>Ferientage verbleibend: <span>0</span></p>

        <div style="width: 400px;"></div>
    `)

    const [title, contigent, booked, left, tableTarget] = planning.children;

    onValueChange(vacationContigent)(value => contigent.children[0].innerText = value)
    onValueChange(currentVacationContigent)(value => {
        booked.children[0].innerText = value
        left.children[0].innerText = valueOf(vacationContigent) - valueOf(currentVacationContigent);
    });

    const tableData = {
        target: tableTarget,
        props: {search: ["Search for Events...", 0, false]},
        model: planningCtrl.getEventListCtrl()
    }

    const renderTableHeader = `
          <tr class="header">
            <th>from</th>
            <th>to</th>
            <th>days</th>
            <th>delete</th>
            <th>status</th>
          </tr>
    `;

    const updateDaysBetween = days => event => {
        days.textContent = valueOf(valueOf(event.from).date).countDaysBetween(valueOf(valueOf(event.to).date)) + 1;
    }

    const renderListItem = (table, event) => {
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

        styleElement(valueOf(event.status))("status-" + valueOf(event.status).toLowerCase())(status.parentElement);

        remove.appendChild(dom('<input type="button" value="X"></div>'))
        const removeBtn = remove.querySelector("input");
        removeBtn.onclick = _ => {
            planningCtrl.deleteEvent(event);
            table.querySelector(`[data-event-id="` + valueOf(event.id) + `"]`).remove();
        }

        // style events on row hovering
        addRowHovering(row)(isHovered => {
            forEach(event.days)(day => setHoverOf(day.event)(isHovered))
        })

        // style row on day hovering
        forEach(event.days)(day => {
            onHoverChange(day.event)(isHovered => styleElement(isHovered)("row-hovering")(row));
        })
    }

    tableProjector(tableData, renderTableHeader, renderListItem)

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
