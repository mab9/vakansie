import {config} from "../../config.js";
import {Observable} from "../base/observable/observable.js";


export {i18n, currentLanguage}

const TRANSLATION_CURRENT_LANGUAGE = 'TRANSLATION_CURRENT_LANGUAGE';
const currentLanguage = Observable(
    localStorage.getItem(TRANSLATION_CURRENT_LANGUAGE)
        ? localStorage.getItem(TRANSLATION_CURRENT_LANGUAGE)
        : config.lang
);
const languages = ['de', 'en'];



const languageFiles = (() => {
    const languageFiles = {};
    const loaded = Observable(false);
    let languageCount = 0;

    languages.forEach(language => {
        fetch("src/assets/i18n/" + language + ".json")
            .then(response => response.json())
            .then(json => {
                languageFiles[language] = json;
                languageCount++;
                if (languages.length === languageCount) loaded.setValue(true);
            })
    });

    return {
        getLang: (lang) => languageFiles[lang],
        loaded
    }
})();

const resolveTranslation = (language, key) => {

    const translation = language[key]
    if (!translation) {
        console.warn('No translation found ¯\\_(ツ)_/¯ for key: ', key);
        return key
    }
    return translation;
};

const i18n = (key) => (destination) => {
    if (!key) { // guard
        console.error('No translation key provided ლ(ಠ_ಠლ)');
        return 'no.i18n.key.provided';
    }

    const callback = (translation) => destination.innerHTML = translation;

    // execute translation when the language is defined.
    const translate = (lang) => {
        const data = languageFiles.getLang(lang)

        if (languageFiles.loaded.getValue()) {
            callback(resolveTranslation(data, key));
        } else {
            languageFiles.loaded.onChange((loaded) => {
                if (loaded) callback(resolveTranslation(data, key));
            })
        }
    };

    currentLanguage.onChange(newLang => {
        localStorage.setItem(TRANSLATION_CURRENT_LANGUAGE, newLang);
        translate(newLang);
    });
};

