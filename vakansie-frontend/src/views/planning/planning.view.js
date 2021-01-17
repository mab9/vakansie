import {appendFirst, appendReplacing, appendsStyle} from "../../assets/util/appends.js";
import {dom} from "../../assets/util/dom.js";
import {allowanceProjector, pageCss as pageCssAllowance} from "./allowance.projector.js";
import {holidayProjector, pageCss as pageCssHoliday} from "./holiday.projector.js";
import {i18n} from "../../service/translation.service.js";
import {calendarProjector} from "../../calendar/calendar.projector.js";

export {PlanningView};

// page-style change, only executed once
appendsStyle(pageCssAllowance);
appendsStyle(pageCssHoliday);

const masterClassName = "planning-main-view"
const detailClassName = "planning-detail-view"


/**
 * @param rootElement
 * @param  planningCtrl {PlanningController}
 * @constructor
 */
const PlanningView = (rootElement, planningCtrl) => {

    // todo style cards / card different than instant update projector!
    const render = () => {
        const planning = dom(`
            <div class="cards">
                <h1>this title will be changed by the translation service</h1>
                <div class="holder">
                    <div    id="masterContainer"></div>
                </div>
            </div>

            <div class="cards">
                <div class="holder" id="detailContainer"></div>
            </div>
        `)

        const title = planning.querySelector("h1"); // select first h1
        i18n('view.planning.title')(title);

        const masterContainer = planning.querySelector("#masterContainer");
        const detailContainer = planning.querySelector("#detailContainer");

        MasterView(masterContainer, planningCtrl);
        DetailView(detailContainer, planningCtrl);

        rootElement.textContent = '';
        appendFirst(rootElement)(planning)
    };

    render();
};

/**
 * @param rootElement
 * @param  planningCtrl {PlanningController}
 * @constructor
 */
const MasterView = (rootElement, planningCtrl) => {
    const render = () => {
        const containerElement = dom(`
            <div id="${masterClassName}-details">
                <h2> Planning Calendar </h2>
                <div id="${masterClassName}-details-calendar">
                    <div id="calendar" class="approval-detail-grid-container"></div> <!-- todo replace code for approval-detail-grid container left over -->
                </div>
            </div>
        `)

        const detailsCalendar = containerElement.querySelector(`#${masterClassName}-details-calendar`)
        calendarProjector(detailsCalendar.children[0], planningCtrl, false);
        appendFirst(rootElement)(containerElement)
    }
    render();
};

/**
 * @param rootElement
 * @param  planningCtrl {PlanningController}
 * @constructor
 */
const DetailView = (rootElement, planningCtrl) => {
     const containerElement = dom(`
        <div id="${detailClassName}-details">
            <div id="${detailClassName}-details-allowance"></div>
            <div id="${detailClassName}-details-holidays"></div>
        </div>
    `)

    const allowance = containerElement.querySelector(`#${detailClassName}-details-allowance`)
    const holiday = containerElement.querySelector(`#${detailClassName}-details-holidays`)

    allowanceProjector(allowance, planningCtrl);
    holidayProjector(holiday, planningCtrl);
    appendReplacing(rootElement)(containerElement);

};

appendsStyle(`
    #${detailClassName}-details {
        display: flex;
        flex-direction: row;
        width: 100%;
    }

    #${detailClassName}-details-allowance {
        width: 47%;
    }

    #${detailClassName}-details-holidays {
        width: 47%;
        margin-left: 5%;
    }
`);
