import {appendFirst} from "../../assets/util/appendFirst.js";
import {dom} from "../../assets/util/dom.js";
import {planningProjector, pageCss} from "./planningProjector.js";
import {i18n} from "../../service/translationService.js";

export {PlanningView};

// page-style change, only executed once
const style = document.createElement("STYLE");
style.innerHTML = pageCss;
document.head.appendChild(style);


/**
 * @param rootElement
 * @param  planningController {PlanningController}
 * @constructor
 */
const PlanningView = (rootElement, planningController) => {

    // todo style cards / card different than instant update projector!
    const render = () => {
        const planning = dom(`
            <div class="cards">
                <h1>this title will be changed by the translation service</h1>
                <div class="holder">
                    <button id="plus" autofocus> + </button>
                    <div    id="masterContainer"></div>
                </div>
            </div>

            <div class="card">
                <h1 data-i18n="view.planning.title.details"></h1>
                <div class="holder" id="detailContainer"></div>
            </div>
        `)



        const title = planning.querySelector("h1"); // select first h1
        const masterContainer = planning.querySelector("#masterContainer");
        //translate('view.planning.title3')((trans) => title.innerHTML = trans);
        i18n('view.planning.title')(title);

        // i18n('key.id')(<h1>Person List</h1>)
        MasterView(masterContainer);
        //DetailView(selectionController, detailContainer);

        rootElement.textContent = '';
        appendFirst(rootElement)(planning)
    };

    render();
};

const MasterView = (rootElement) => {

    const render = () => planningProjector(rootElement);

    render();

};

const DetailView = (selectionController, rootElement) => {
    const render = person => formProjector(selectionController, rootElement, person, ALL_PERSON_ATTRIBUTE_NAMES);
    selectionController.onModelSelected(render);
};
