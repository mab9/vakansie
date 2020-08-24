/**
 * @module Controllers as shallow wrappers around observables
 */
import { ObservableList, Observable }                       from "../../base/observable/observable.js";
import {ALL_PERSON_ATTRIBUTE_NAMES, Person} from "./personModel.js";

export { ListController, SelectionController, PersonController }

const ListController = modelConstructor => {

    const listModel = ObservableList([]); // observable array of models, this state is private

    return {
        addModel:            () => listModel.add(modelConstructor()),
        removeModel:         listModel.del,
        onModelAdd:          listModel.onAdd,
        onModelRemove:       listModel.onDel,
    }
};

const SelectionController = noSelection => {

    const selectedModelObs = Observable(noSelection);

    return {
        setSelectedModel : selectedModelObs.setValue,
        getSelectedModel : selectedModelObs.getValue,
        onModelSelected:   selectedModelObs.onChange,
        clearSelection:     () => selectedModelObs.setValue(noSelection),
    }
};

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

const NoPerson = (() => { // one time creation, singleton
    const johnDoe = Person();
    ALL_PERSON_ATTRIBUTE_NAMES.forEach(name => johnDoe[name].setConvertedValue(""));
    return johnDoe;
})();
