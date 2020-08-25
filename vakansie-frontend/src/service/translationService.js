import {config} from "../../config.js";
import {Observable} from "../base/observable/observable.js";

export {i18n, currentLanguage}

const TRANSLATION_CURRENT_LANGUAGE = 'TRANSLATION_CURRENT_LANGUAGE';


// load language from storage or set default from config
const currentLanguage = Observable(
    localStorage.getItem(TRANSLATION_CURRENT_LANGUAGE)
        ? localStorage.getItem(TRANSLATION_CURRENT_LANGUAGE)
        : config.lang
);

const TranslationService = () => {
    const loadedLangs = {};
    const isLangLoaded = Observable(false);

    const init = () => {
        let loadedLangCounter = 0;
        const langs = config.langTranslations;

        langs.forEach(lang => {
            fetch("src/assets/i18n/" + lang + ".json")
            .then(response => response.json())
            .then(json => {
                loadedLangs[lang] = json;
                loadedLangCounter++;
                if (langs.length === loadedLangCounter) {
                    isLangLoaded.setValue(true);
                }
            })
        });

        return {

        }
    }

    // loadlang
    // onChange lang
    // isLangLoaded
    // resolve lang
    // execute translation when the language is defined.
    const translate = (lang, key, callback) => {
        const data = loadedLangs[lang]

        if (isLangLoaded.getValue()) {
            callback(resolveTranslation(data, key));
        } else {
            isLangLoaded.onChange((loaded) => {
                if (loaded) {
                    callback(resolveTranslation(data, key));
                }
            })
        }
    };

    return Object.freeze({
        translate: translate,
        init: init,
        isLangLoaded: isLangLoaded
    })
}

const translationService = TranslationService();
export {translationService}


const resolveTranslation = (language, key) => {

    const translation = language[key]
    if (!translation) {
        console.warn('No translation found ¯\\_(ツ)_/¯ for key: ', key);
        return key
    }
    return translation;
};

const i18n = (key) => (destination) => {
    if (!key) {     // guard
        console.error('No translation key provided ლ(ಠ_ಠლ)');
        return 'no.i18n.key.provided';
    }

    const callback = (translation) => destination.innerHTML = translation;

    currentLanguage.onChange(newLang => {
        localStorage.setItem(TRANSLATION_CURRENT_LANGUAGE, newLang);
        translationService.translate(newLang, key, callback);
    });
};

