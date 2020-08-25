import {appendFirst} from "../../assets/util/appendFirst.js";
import {dom} from "../../assets/util/dom.js";
import {listItemProjector, formProjector, pageCss} from "../person/instantUpdateProjector.js";
import {translate} from "../../service/translationService.js";

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

    const render = () => {
        const person = dom(`
            <div class="card">
                <h1>Person List</h1>
                <div class="holder">
                    <button id="plus" autofocus> + </button>
                    <div    id="masterContainer"></div>
                </div>
            </div>

            <div class="card">
                <h1>Person Detail</h1>
                <div class="holder" id="detailContainer"></div>
            </div>
        `)



        const title = person.querySelector("h1"); // select first h1
        translate('view.planning.title')((trans) => {
                        title.innerHTML = trans;
                    });

        //MasterView(listController, selectionController, masterContainer);
        //DetailView(selectionController, detailContainer);

        rootElement.textContent = '';
        appendFirst(rootElement)(person)
    };

    render();
};

const MasterView = (listController, selectionController, rootElement) => {

    const render = person => listItemProjector(listController, selectionController, rootElement,
            person, ['firstname', 'lastname']);

    // binding
    listController.onModelAdd(render);

    // init list
    // todo if list controller list size > 0 add models ...

};

const DetailView = (selectionController, rootElement) => {
    const render = person => formProjector(selectionController, rootElement, person, ALL_PERSON_ATTRIBUTE_NAMES);
    selectionController.onModelSelected(render);
};
