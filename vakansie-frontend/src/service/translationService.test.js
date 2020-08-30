import {I18N_CURRENT_LANG, translationService} from "./translationService.js";
import {Suite} from "../test/test.js";
import {config} from "../../config.js";

const util = Suite("translation-service");

// i18n
// translate? // dom translation?

util.add("service initialization", assert => {
    // reset cache and pre initialized observable
    localStorage.setItem(I18N_CURRENT_LANG, config.lang);
    translationService.currentLang.setValue(config.lang)

    assert.true(!translationService.isLangLoaded.getValue());
    assert.is(translationService.currentLang.getValue(), config.lang);
});

util.add("language change", assert => {
    // reset cache and pre initialized observable
    localStorage.setItem(I18N_CURRENT_LANG, config.lang);
    translationService.currentLang.setValue(config.lang)

    assert.true(!translationService.isLangLoaded.getValue());
    assert.is(translationService.currentLang.getValue(), config.lang);

    translationService.currentLang.setValue('en')
    assert.is(localStorage.getItem(I18N_CURRENT_LANG), 'en');
});

util.run();
