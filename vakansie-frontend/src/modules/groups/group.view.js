import {appendFirst, appendsStyle} from "../../assets/util/appends.js";
import {dom} from "../../assets/util/dom.js";
import {groupProjector, pageCss as pageCssGroup} from "./group.projector.js";
import {i18n} from "../../service/translationService.js";

export {GroupView};

// page-style change, only executed once
appendsStyle(pageCssGroup);


/**
 * @param rootElement
 * @param  groupCtrl {GroupController}
 * @constructor
 */
const GroupView = (rootElement, groupCtrl) => {

    const render = () => {
        const planning = dom(`
            <div class="cards">
                <h1>this title will be changed by the translation service</h1>
                <div class="holder">
                    <div    id="masterContainer"></div>
                </div>
            </div>
            <div class="cards">
                <h1 data-i18n="view.group.title.details"></h1>
                <div class="holder" id="detailContainer"></div>
            </div>
        `)

        const title = planning.querySelector("h1"); // select first h1
        i18n('view.group.title')(title);

        const masterContainer = planning.querySelector("#masterContainer");
        const detailContainer = planning.querySelector("#detailContainer");

        MasterView(masterContainer, groupCtrl);
        //DetailView(detailContainer, groupCtrl);

        rootElement.textContent = '';
        appendFirst(rootElement)(planning)
    };

    render();
};

/**
 * @param rootElement
 * @param groupCtrl {GroupController}
 * @constructor
 */
const MasterView = (rootElement, groupCtrl) => {
    const render = () => groupProjector(rootElement, groupCtrl);
    render();
};

/**
 * @param rootElement
 * @param groupCtrl {GroupController}
 * @constructor
 */
const DetailView = (rootElement, groupCtrl) => {
    //const render = () => userProjector(rootElement, groupCtrl);
    //render();
};

