import {appendFirst, appendsStyle} from "../../assets/util/appends.js";
import {dom} from "../../assets/util/dom.js";
import {pageCss as pageCssMonth, verifyCalendarProjector} from "./verifyCalendar.projector.js";
import {pageCss as pageCssUserGroup, userGroupProjector} from "./userGroup.projector.js";
import {i18n} from "../../service/translation.service.js";

export {VerifyView};

// page-style change, only executed once
appendsStyle(pageCssUserGroup);
appendsStyle(pageCssMonth);


/**
 * @param rootElement
 * @param  verifyCtrl {VerifyController}
 * @constructor
 */
const VerifyView = (rootElement, verifyCtrl) => {

    const render = () => {
        const planning = dom(`
            <div class="cards">
                <h1>this title will be changed by the translation service</h1>
                <div class="holder">
                    <div    id="masterContainer"></div>
                </div>
            </div>
            <div class="cards">
                <h1 data-i18n="view.verify.title.details"></h1>
                <div class="holder" id="detailContainer"></div>
            </div>
        `)

        const title = planning.querySelector("h1"); // select first h1
        i18n('view.verify.title')(title);

        const masterContainer = planning.querySelector("#masterContainer");
        const detailContainer = planning.querySelector("#detailContainer");

        MasterView(masterContainer, verifyCtrl);
        DetailView(detailContainer, verifyCtrl);

        rootElement.textContent = '';
        appendFirst(rootElement)(planning)
    };

    render();
};

/**
 * @param rootElement
 * @param verifyCtrl {VerifyController}
 * @constructor
 */
const MasterView = (rootElement, verifyCtrl) => {
    const render = () => userGroupProjector(rootElement, verifyCtrl);
    render();
};

/**
 * @param rootElement
 * @param verifyCtrl {VerifyController}
 * @constructor
 */
const DetailView = (rootElement, verifyCtrl) => {
    const render = () => verifyCalendarProjector(rootElement, verifyCtrl);
    render();
};

