export {Observable, ObservableList}

/**
 * @param value
 * @return {Observable}
 * @constructor
 */
const Observable = value => {
    const listeners = [];

    /**
     * @typedef Observable
     * @type {object}
     * @property {function} onChange.
     * @property {function} getValue.
     * @property {function} setValue.
     */
    return {
        onChange: callback => {
            listeners.push(callback);
            callback(value, value);
        },
        getValue: () => value,
        setValue: newValue => {
            if (value === newValue) return;
            const oldValue = value;
            value = newValue;
            listeners.forEach(callback => callback(value, oldValue));
        }
    }
};


const ObservableList = list => {
    const addListeners = [];
    const delListeners = [];
    const add  = item => {
            list.push(item);
            addListeners.forEach(listener => listener(item));
            return item;}
    const removeAt = array => index => array.splice(index, 1);
    const removeItem = array => (item, findIdxFn) => {
        const i = findIdxFn ? array.findIndex(findIdxFn) : array.indexOf(item);
        if (i >= 0) removeAt(array)(i);
    };
    const listRemoveItem = removeItem(list);
    const delListenersRemove = removeAt(delListeners);
    const del = (item, findIdxFn) => {
        listRemoveItem(item, findIdxFn);
        const safeIterate = [...delListeners]; // shallow copy as we might change listeners array while iterating
        safeIterate.forEach((listener, index) => listener(item, () => delListenersRemove(index)));
    };

    const contains = item => list.find(observable => observable.getValue().id === item.getValue().id);

    return {
        onAdd: listener => addListeners.push(listener),
        onDel: listener => delListeners.push(listener),
        add: add,
        addIfNotExists : item => {
            if (!contains(item)) {
                add(item);
            }
            return item;
        },
        del: del,
        removeDeleteListener: removeItem(delListeners),
        count: () => list.length,
        countIf: pred => list.reduce((sum, item) => pred(item) ? sum + 1 : sum, 0),
        clear: () => list.forEach(item => del(item)),
        list
    }
};
