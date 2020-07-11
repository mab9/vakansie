import {appendFirst} from "../util/appendFirst.js";
import {dom} from "../util/dom.js";
import {listItemProjector, formProjector} from "./instantUpdateProjector.js";
import {Attribute, LABEL} from "../presentationModel/presentationModel.js";
import {ListController, SelectionController} from "./controller.js";

export {personController, PersonView};

/**
 * @return Readonly {PersonController}
 * @constructor
 */
const PersonController = () => {

    /**
     * @typedef PersonController
     */
    return Object.freeze({});
};
const personController = PersonController();

/**
 * @param rootElement
 * @constructor
 */
const PersonView = ({rootElement}) => {
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

        const listController = ListController(Person);
        const selectionController = SelectionController(NoPerson);

        const masterContainer = person.querySelector("#masterContainer");
        const detailContainer = person.querySelector("#detailContainer");
        const plus = person.querySelector("#plus");
        plus.onclick = _ => listController.addModel();

        MasterView(listController, selectionController, masterContainer);
        DetailView(selectionController, detailContainer);

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
};

const DetailView = (selectionController, rootElement) => {
    const render = person => formProjector(selectionController, rootElement, person, ALL_ATTRIBUTE_NAMES);
    selectionController.onModelSelected(render);
};

const ALL_ATTRIBUTE_NAMES = ['firstname', 'lastname', 'job'];

const Person = () => {                               // facade
    const firstnameAttr = Attribute("Silvestre");
    firstnameAttr.getObs(LABEL).setValue("First Name");

    const lastnameAttr = Attribute("Brue");
    lastnameAttr.getObs(LABEL).setValue("Last Name");

    const jobAttr = Attribute("boss");
    jobAttr.getObs(LABEL).setValue("My crazy job");

    jobAttr.setConverter(input => input.toUpperCase());
    jobAttr.setValidator(input => input.length >= 3);

    return {
        firstname: firstnameAttr,
        lastname: lastnameAttr,
        job: jobAttr,
    }
};

const NoPerson = (() => { // one time creation, singleton
    const johnDoe = Person();
    ALL_ATTRIBUTE_NAMES.forEach(name => johnDoe[name].setConvertedValue(""));
    return johnDoe;
})();
