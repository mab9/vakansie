import {appendFirst} from "../../assets/util/appendFirst.js";
import {dom} from "../../assets/util/dom.js";
import {listItemProjector, formProjector, pageCss} from "./instantUpdateProjector.js";
import {ListController, SelectionController} from "./controller.js";
import {ALL_PERSON_ATTRIBUTE_NAMES, Person } from "./personModel.js";

export {PersonController, PersonView};

// page-style change, only executed once
const style = document.createElement("STYLE");
style.innerHTML = pageCss;
document.head.appendChild(style);


const NoPerson = (() => { // one time creation, singleton
    const johnDoe = Person();
    ALL_PERSON_ATTRIBUTE_NAMES.forEach(name => johnDoe[name].setConvertedValue(""));
    return johnDoe;
})();


/**
 * @return Readonly {PersonController}
 * @constructor
 */
const PersonController = () => {
    const listController = ListController(Person);
    const selectionController = SelectionController(NoPerson);

    const getListController      = () => listController;
    const getSelectionController = () => selectionController;

    /**
     * @typedef PersonController
     */
    return Object.freeze({
        getListController : getListController,
        getSelectionController : getSelectionController,
    });
};

/**
 * @param rootElement
 * @param personController PersonController
 * @constructor
 */
const PersonView = (rootElement, personController) => {


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
        plus.onclick = _ => listController.addModel();

        MasterView(listController, selectionController, masterContainer);
        DetailView(selectionController, detailContainer);

        rootElement.textContent = '';
        appendFirst(rootElement)(person)
    };

    const listController      = personController.getListController();
    const selectionController = personController.getSelectionController();


    // todo if list controller list size > 0 add models ...

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
