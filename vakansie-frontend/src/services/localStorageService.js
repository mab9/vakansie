/**
 * @return LocalStorageService
 */
const LocalStorageService = () => {
    const keyExistsInLocalStorage = (key) => Boolean(localStorage.getItem(key));
    const fromLocalStorage = (key) => localStorage.getItem(key);
    const toLocalStorage = (key, value) => localStorage.setItem(key, value);

    /**
     * @typedef {Readonly<object>} LocalStorageService
     * @property {function} toLocalStorage
     * @property {function} fromLocalStorage
     * @property {function} keyExistsInLocalStorage
     */
    return Object.freeze({
        toLocalStorage,
        fromLocalStorage,
        keyExistsInLocalStorage,
    })
};

const localStorageService = LocalStorageService();

export {localStorageService}
