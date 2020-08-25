import {config} from "../../config.js";
import {Observable} from "../base/observable/observable.js";

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

    console.info("i18n1", language)
    console.info("i18n2", key)

    const translation = language[key]
    if (!translation) {
        console.warn('No translation found ¯\\_(ツ)_/¯ for key: ', key);
        return key
    }
    return translation;
};

const translate = (key) => (callback) => {
    if (!key) {
        console.warn('No translation key provided ლ(ಠ_ಠლ)');
        return;
    }

    // execute translation when the language is defined.
    const run = (newLang) => {
        const lang = languageFiles.getLang(newLang)
        console.info(lang)

        if (languageFiles.loaded.getValue()) {
            callback(resolveTranslation(lang, key));
        } else {
            languageFiles.loaded.onChange((loaded) => {
                if (loaded) callback(resolveTranslation(lang, key));
            })
        }
    };

    currentLanguage.onChange(newLang => {
        localStorage.setItem(TRANSLATION_CURRENT_LANGUAGE, newLang);
        run(newLang);
    });
};

export {translate, currentLanguage}
