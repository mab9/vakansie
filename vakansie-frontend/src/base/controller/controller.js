/**
 * @module Controllers as shallow wrappers around observables
 */
import { ObservableList, Observable }                       from "../observable/observable.js";

export { ListController, SelectionController }

const ListController = () => {

    const innerList = [];                        // internal use only
    const listModel = ObservableList(innerList); // observable array of models, this state is private

    const findById  = modelId => innerList.find( model => valueOf(model.id) === modelId);


    return {
        addModel:            model => listModel.add(model),
        findById,
        removeModel:         listModel.del,
        onModelAdd:          listModel.onAdd,
        onModelRemove:       listModel.onDel,
        size:                listModel.count,
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

