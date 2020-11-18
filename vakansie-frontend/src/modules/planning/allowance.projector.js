import {appendReplacing} from "../../assets/util/appends.js";
import {dom} from "../../assets/util/dom.js";
import "../../assets/util/times.js"
import {HOVER, onValueChange, valueOf} from "../../base/presentationModel/presentationModel.js";
import "../../assets/util/dates.js"
import {styleElement} from "../../assets/util/cssClasses.js";

export {allowanceProjector, pageCss}

const detailClassName = 'planning-detail';

const creatRowEntries = row => {
    let entries = [];

    let from = row.insertCell();
    let text = document.createTextNode("");
    from.appendChild(text);
    entries[0] = text;

    let to = row.insertCell();
    text = document.createTextNode("");
    to.appendChild(text);
    entries[1] = text;

    let days = row.insertCell();
    text = document.createTextNode("");
    days.appendChild(text);
    entries[2] = text;

    let remove = row.insertCell();
    text = dom('<input type="button" value="X"></div>');
    remove.appendChild(text);
    entries[3] = remove.querySelector("input");
    return entries;
}

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
        <h2> Ferien von nach </h2>

        <!-- todo create fancy table generator analogue angular -->
        <table class="${detailClassName}-table">
          <tr>
            <th>from</th>
            <th>to</th>
            <th>days</th>
            <th>delete</th>
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
    const tbody = table.children[0]; // tbody
    // const thead = tbody.children[0]; // tr th head
    // const trow = tbody.children[1];  // tr th head

    const updateDaysBetween = days => event => {
        days.textContent = valueOf(valueOf(event.from).date).daysBetween(valueOf(valueOf(event.to).date)) + 1;
    }

    /** @event event {Event} */
    const processEvent = event => {
        let row = tbody.insertRow();
        let [start, end, days, remove] = creatRowEntries(row);

        row.dataset.eventId = valueOf(event.id);
        start.textContent = valueOf(valueOf(event.from).date).getFormated();
        end.textContent = valueOf(valueOf(event.to).date).getFormated();

        onValueChange(event.from)(day => {
            start.textContent = valueOf(day.date).getFormated();
            updateDaysBetween(days)(event)
        });

        onValueChange(event.to)(day => {
            end.textContent = valueOf(day.date).getFormated();
            updateDaysBetween(days)(event)
        });

        remove.onclick = _ => {
            planningCtrl.deleteEvent(event);
            table.querySelector(`[data-event-id="` + valueOf(event.id) + `"]`).remove();
        }

        const dayListCtrl = valueOf(event.days)
        const eventDays = dayListCtrl.getAll();

        eventDays.forEach(day => {
            day.event.getObs(HOVER).onChange(isHovered => {
                styleElement(isHovered)("row-hovering")(row)
            });
        })

        const styleRowOnHover = isHovered => {
            eventDays.forEach(day => {
                day.event.getObs(HOVER).setValue(isHovered);
            })
        }


        row.onmouseover = _ => styleRowOnHover(true);
        row.onmouseleave = _ => styleRowOnHover(false);
    }


    eventListCtrl.getAll().forEach(event => processEvent(event))
    eventListCtrl.onModelAdd(event => processEvent(event))

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
`;
