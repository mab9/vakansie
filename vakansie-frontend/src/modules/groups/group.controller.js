import {Attribute, valueOf} from "../../base/presentationModel/presentationModel.js";
import "../../assets/util/dates.js"
import {groupService} from "./group.service.local.js";

export {GroupController}

/**
 * @typedef GroupController
 * @property {Function} getTenantGroup
 * @property {Function} getGroups
 * @property {Function} getProjectGroups
 * @property {Function} getChildGroups
 */
const GroupController = (isCtrlInitialized = false) => {

    /** @type {ListController} */
    const groups = groupService.getGroups();
    const isMouseDown = Attribute(false);

    const getTenantGroup = () => groups.getAll().find(group => valueOf(group.isTenant));
    const getProjectGroups = () => groups.getAll().filter(group => valueOf(group.isProject))

    /** @param {Group} group
     * @param {boolean} withProjects */
    const getChildsByBroup = (group, withProjects = true) => {
        const ids = valueOf(group.childIds).getAll();
        const filtered = groups.getAll().filter(group => ids.indexOf(valueOf(group.id)) >= 0);
        return withProjects ? filtered : (() => filtered.filter(group => !valueOf(group.isProject)))()
    }

    isCtrlInitialized = true;

    return Object.freeze({
        getTenantGroup,
        getGroups: () => groups.getAll(),
        getProjectGroups,
        getChildsByBroup,
    });
};


