import {dom} from "../../vakansie-frontend/src/assets/util/dom.js";
import {tableProjector} from "./table.projector.js";
import {Attribute, valueOf} from "../../vakansie-frontend/src/base/presentationModel/presentationModel.js";
import {ListController} from "../../vakansie-frontend/src/base/controller/controller.js";
import {creatRowEntries} from "../../vakansie-frontend/src/service/table.service.js";
import {styleElement} from "../../vakansie-frontend/src/assets/util/cssClasses.js";
import {CalendarController} from "./calendar.controller.js";
import {PlanningController} from "../../vakansie-frontend/src/views/planning/planning.controller.js";
import {calendarProjector} from "./calendar.projector.js";

export {mainProjector}


const mainProjector = rootElement => {

    const mainElements = dom(`
        <div class="card main-content-upper--left"><h2>Holidays</h2></div>
        <div class="card main-content-upper--right"><h2>Events</h2></div>
        <div class="card main-content-lower"><h2>Calendar</h2></div>
    
    `)

    ruleCard(mainElements.children[0]);
    eventCard(mainElements.children[1]);
    calendarCard(mainElements.children[2]);

    rootElement.appendChild(mainElements)
}

const ruleCard = rootElement => {
    const ruleListCtrl = ListController();
    ruleListCtrl.addModel({
        name: Attribute("Min 1 available per day"),
        days: Attribute(ListController),
        active: Attribute(true)
    })
    ruleListCtrl.addModel({
        name: Attribute("Min 1 Architect per day"),
        days: Attribute(ListController),
        active: Attribute(true)
    })

    const tableData = {
        target: rootElement,
        props: {search: ["Search for Rules...", 0, false]},
        model: ruleListCtrl
    }

    const renderTableHeader = `
          <tr class="header">
            <th style="width:80%;">Rule name</th>
            <th style="width:20%;">active</th>
          </tr>
    `;

    const renderTableItem = (table, item) => {
        const [name, active, row] = creatRowEntries(table);
        name.textContent = valueOf(item.name);

        active.innerHTML = `<input id="checky" type="checkbox">`;
    }

    tableProjector(tableData, renderTableHeader, renderTableItem)
}

const eventCard = rootElement => {
    const calendarCtrl = CalendarController();
    calendarCtrl.initPlanningEvents();

    const tableData = {
        target: rootElement,
        props: {search: ["Search for Events...", 0, false]},
        model: calendarCtrl.getEventListCtrl()
    }

    const renderTableHeader = `
          <tr class="header">
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            <th style="width: 20%">Remove</th>
          </tr>
    `;

    const renderTableItem = (table, item) => {
        let [start, end, status, remove, row] = creatRowEntries(table);

        row.dataset.eventId = valueOf(item.id);
        start.textContent = valueOf(valueOf(item.from).date).getFormatted();
        end.textContent = valueOf(valueOf(item.to).date).getFormatted();

        styleElement(valueOf(item.status))("status-" + valueOf(item.status).toLowerCase())(status.parentElement);

        remove.appendChild(dom('<i class="fas fa-trash-alt"></i>'))
        const removeBtn = remove.querySelector("i");
        removeBtn.onclick = _ => {
            table.querySelector(`[data-event-id="` + valueOf(item.id) + `"]`).remove();
        }
    }

    tableProjector(tableData, renderTableHeader, renderTableItem)
}

const calendarCard = rootElement => {
    const element = dom(`<div></div>`)  // render calendar into this div instead of the main content card
    const planningCtrl = PlanningController();
    calendarProjector(element.children[0], planningCtrl,false);
    rootElement.appendChild(element);
}
