import {config} from "../../config.js";
import {Observable} from "../base/observable/observable.js";

export {i18n} // See export below!

const TRANSLATION_CURRENT_LANGUAGE = 'TRANSLATION_CURRENT_LANGUAGE';

const TranslationService = () => {
    const loadedLangs = {};
    const isLangLoaded = Observable(false);

    // load language from storage or set default from config
    const currentLanguage = Observable(
        localStorage.getItem(TRANSLATION_CURRENT_LANGUAGE)
            ? localStorage.getItem(TRANSLATION_CURRENT_LANGUAGE)
            : config.lang
    );

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
    }

    const resolveTranslation = (language, key) => {

        const translation = language[key]
        if (!translation) {
            console.warn('No translation found ¯\\_(ツ)_/¯ for key: ', key);
            return key
        }
        return translation;
    };

    // execute translation as soon as possible
    const translate = (lang, key, callback) => {
        const data = loadedLangs[lang]

        if (isLangLoaded.getValue()) {
            callback(resolveTranslation(data, key));
        } else {
            // todo be sure to not miss the on change event!
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
        isLangLoaded: isLangLoaded,
        currentLanguage: currentLanguage,
    })
}

const translationService = TranslationService(); // singleton, init in module to avoid two instances. See export at the top of the file
export {translationService}

const i18n = (key) => (destination) => {
    if (!key) {     // guard
        console.error('No translation key provided ლ(ಠ_ಠლ)');
        return 'no.i18n.key.provided';
    }

    const callback = (translation) => destination.innerHTML = translation;

    translationService.currentLanguage.onChange(newLang => {
        localStorage.setItem(TRANSLATION_CURRENT_LANGUAGE, newLang);
        translationService.translate(newLang, key, callback);
    });
};

