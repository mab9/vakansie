/**
 * @module Controllers as shallow wrappers around observables
 */
import {Observable, ObservableList} from "../observable/observable.js";
import {valueOf} from "../presentationModel/presentationModel.js";

export {ListController, SelectionController}

/**
 * @typedef ListController
 * @property {Function} addModel
 * @property {Function} findById
 * @property {Function} removeModel
 * @property {Function} onModelAdd
 * @property {Function} onModelRemove
 * @property {Function} size
 * @property {Function} getAll
 * @property {Function} reset
 * @property {Function} pop
 */
const ListController = () => {

    const innerList = [];                        // internal use only
    const listModel = ObservableList(innerList); // observable array of models, this state is private

    const findById = modelId => innerList.find(model => valueOf(model.id) === modelId);

    return {
        addModel: model => listModel.add(model),
        findById,
        removeModel: listModel.del,
        onModelAdd: listModel.onAdd,
        onModelRemove: listModel.onDel,
        size: () => listModel.count(),
        getAll: () => innerList,
        reset: () => innerList.splice(0, innerList.length),
        pop: () => innerList[innerList.length - 1],
    }
};

/**
 * @typedef SelectionController
 * @property {Function} setSelectedModel
 * @property {Function} getSelectedModel
 * @property {Function} onModelSelected
 * @property {Function} clearSelection
 */
const SelectionController = noSelection => {

    const selectedModelObs = Observable(noSelection);

    return {
        setSelectedModel: selectedModelObs.setValue,
        getSelectedModel: selectedModelObs.getValue,
        onModelSelected: selectedModelObs.onChange,
        clearSelection: () => selectedModelObs.setValue(noSelection),
    }
};

