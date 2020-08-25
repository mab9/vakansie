import {appendFirst} from "../../assets/util/appendFirst.js";
import {dom} from "../../assets/util/dom.js";
import {listItemProjector, formProjector, pageCss} from "./instantUpdateProjector.js";
import {ALL_PERSON_ATTRIBUTE_NAMES } from "./personModel.js";
import {Person} from "./personModel.js";

export {PersonView};

// page-style change, only executed once
const style = document.createElement("STYLE");
style.innerHTML = pageCss;
document.head.appendChild(style);


/**
 * @param rootElement
 * @param  personController {PersonController}
 * @constructor
 */
const PersonView = (rootElement, personController) => {

    const listController      = personController.getListController();
    const selectionController = personController.getSelectionController();

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

        const masterContainer = person.querySelector("#masterContainer");
        const detailContainer = person.querySelector("#detailContainer");
        const plus = person.querySelector("#plus");
        plus.onclick = _ => listController.addModel(Person());

        MasterView(listController, selectionController, masterContainer);
        DetailView(selectionController, detailContainer);

        rootElement.textContent = '';
        appendFirst(rootElement)(person)
    };

    render();
    personController.initPersons();
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