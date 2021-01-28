import {appendFirst} from "../../assets/util/appends.js";
import {dom} from "../../assets/util/dom.js";
import "../../assets/util/times.js"
import "../../assets/util/dates.js"
import {labelOf, setHoverOf, valueOf} from "../../base/presentationModel/presentationModel.js";
import {addRowHovering, creatRowEntries} from "../../service/table.service.js";

import {tableProjector} from "./table.projector.js"

export {holidayProjector}

// pre fix to keep it short
const pf = 'planning-holiday'; // should be unique for this projector

/**
 * @param  rootElement        {HTMLElement}
 * @param  planningCtrl {PlanningController}
 */
const holidayProjector = (rootElement, planningCtrl) => {

    const holidays = dom(`
        <h2> Feiertage </h2>
        <p>Feiertage dieses Jahr: <span>20</span></p>
        <div style="width: 400px;"></div>
    `)

    const feiertage = holidays.querySelector("span")
    const holidayListCtrl = planningCtrl.getHolidayListCtrl();
    feiertage.innerText = holidayListCtrl.size();

    const tableData = {
        target: holidays.children[2],
        props: {search: ["Search for holidays...", 0, false]},
        model: holidayListCtrl
    }

    const renderTableHeader = `
          <tr class="header">
            <th>Feiertag</th>
            <th>Datum</th>
          </tr>
    `;

    const renderTableData = (table, day) => {
        let [holiday, date, row] = creatRowEntries(table);
        holiday.innerText = labelOf(day.holiday);
        date.innerText = valueOf(day.date).getFormatted();
        addRowHovering(row)(isHovered => setHoverOf(day.holiday)(isHovered))
    }

    // todo pass table projector config -> paginator, search bar, searchbar labels and so on.
    tableProjector(tableData, renderTableHeader, renderTableData)

    appendFirst(rootElement)(holidays)
};
