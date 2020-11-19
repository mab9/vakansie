import {appendFirst, appendsStyle} from "../../assets/util/appends.js";
import {dom} from "../../assets/util/dom.js";
import {pageCss as pageCssPlanning, planningProjector} from "./planning.projector.js";
import {allowanceProjector, pageCss as pageCssAllowance} from "./allowance.projector.js";
import {holidayProjector, pageCss as pageCssHoliday} from "./holiday.projector.js";
import {i18n} from "../../service/translationService.js";

export {PlanningView};

// page-style change, only executed once
appendsStyle(pageCssPlanning);
appendsStyle(pageCssAllowance);
appendsStyle(pageCssHoliday);


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
                <h1 data-i18n="view.planning.title.details"></h1>
                <div class="holder" id="detailContainer"></div>
            </div>
            <div class="cards">
                <h1 data-i18n="view.planning.title.holidays"></h1>
                <div class="holder" id="holidaysContainer"></div>
            </div>
        `)

        const title = planning.querySelector("h1"); // select first h1
        i18n('view.planning.title')(title);

        const masterContainer = planning.querySelector("#masterContainer");
        const detailContainer = planning.querySelector("#detailContainer");
        const holidaysContainer = planning.querySelector("#holidaysContainer");

        MasterView(masterContainer, planningCtrl);
        DetailView(detailContainer, planningCtrl);
        HolidayView(holidaysContainer, planningCtrl);

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
    const render = () => planningProjector(rootElement, planningCtrl);
    render();
};

/**
 * @param rootElement
 * @param  planningCtrl {PlanningController}
 * @constructor
 */
const DetailView = (rootElement, planningCtrl) => {
    const render = () => allowanceProjector(rootElement, planningCtrl);
    render();
};

/**
 * @param rootElement
 * @param  planningCtrl {PlanningController}
 * @constructor
 */
const HolidayView = (rootElement, planningCtrl) => {
    const render = () => holidayProjector(rootElement, planningCtrl);
    render();
};
