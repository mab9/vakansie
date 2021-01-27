import {setValueOf, valueOf} from "../../base/presentationModel/presentationModel.js";
import "../../assets/util/dates.js"
import {groupService} from "./group.service.local.js";
import {ListController, SelectionController} from "../../base/controller/controller.js";
import {ALL_GROUP_ATTRIBUTE_NAMES, Group} from "./group.model.js";

export {GroupController}

/**
 * @return Readonly GroupController
 * @constructor
 */
const GroupController = (isCtrlInitialized = false) => {


    /** @type {ListController} */  // todo use a tree?
    const listController = ListController();
    const getTenantGroup = () => listController.getAll().find(group => valueOf(group.isTenant));

    /** @type {SelectionController} */
    const selectedGroup = SelectionController(NoGroup);
    /** @type {SelectionController} */
    const selectedBucket = SelectionController(getTenantGroup());

    /** @param {Group} group
     * @param {boolean} withProjects */
    const getChildrenByGroup = (group, withProjects = true) => {
        const ids = valueOf(group.childIds).getAll();
        const filtered = listController.getAll().filter(item => ids.indexOf(valueOf(item.id)) >= 0);
        return withProjects ? filtered : (() => filtered.filter(item => !valueOf(item.isProject)))()
    }

    const getMyParentsSorted = group => {
        let parentList = [];
        let parent = getParentGroup(group);
        while (parent) {
            parentList.push(parent);
            parent = getParentGroup(parent);
        }
        return parentList;
    }

    /*
        remove all child groups - recursive
        remove child ref in parent
        remove from list ctrl
     */
    const removeGroup = group => {
        removeChildrenGroups(group);
        const parent = getParentGroup(group);
        /** @type {ListController} */
        const childrenListCtrl = valueOf(parent.childIds);
        childrenListCtrl.removeModel(valueOf(group.id));
        listController.removeModel(group);
    }

    /* Recursive removal from the given groups and child groups */
    const removeChildrenGroups = group => {
        /** @type {ListController} */
        const childrenListCtrl = valueOf(group.childIds);
        const childrenIds = childrenListCtrl.getAll();
        childrenIds.forEach(id => {
            const childGroup = listController.findById(id);
            listController.removeModel(childGroup);
            removeChildrenGroups(childGroup);
        })
    }

    const getParentUsersNotInChildGroup = childGroup => {
        const parentGroup = getParentGroup(childGroup);
        if (!parentGroup) return [];

        const usersChild = getGroupUsers(childGroup);
        const usersParent = getGroupUsers(parentGroup);

        return usersParent.getAll().filter(user => !usersChild.findById(valueOf(user.id)));
    }

    // todo check if load group users via group / personen ctrl
    const getGroupUsers = group => groupService().loadGroupUsers(valueOf(group.id))(listController.getAll());

    /** @param {Group} child */
    const getParentGroup = child => listController.getAll().find(group => valueOf(group.id) === valueOf(child.parentId))


    /* Recursive removal of the given user from the given group and all child groups but projects. */
    const removeUserFromGroup = user => group => {
        if (!valueOf(group.isProject)) {
            const groupy = listController.findById(valueOf(group.id));
            const groupUsers = valueOf(groupy.userIds);
            groupUsers.removeModel(valueOf(user.id))

            // recursion
            const childrenIds = valueOf(groupy.childIds).getAll();
            childrenIds.forEach(id => removeUserFromGroup(user)(listController.findById(id)));
        }
    }

    const addUserToGroup = user => group => {
        const groupy = listController.findById(valueOf(group.id));
        const groupUsers = valueOf(groupy.userIds);
        groupUsers.addModel(valueOf(user.id));
    }

    // todo check if we use the same impl as person uses.
    /** @param {Group} groupData */
    const addGroup = (groupData)  => {
        const group = Group();
        ALL_GROUP_ATTRIBUTE_NAMES.forEach(attribute => {
            setValueOf(group[attribute])(groupData[attribute]);  // todo sollte value of groupData[attr sein
        })

        listController.addModel(group);
    };

    const initGroups = () => groupService().loadGroups().forEach(group => addGroup(group));


    /**
    * @typedef GroupController
    */
    return Object.freeze({
        initGroups,
        getListController: () => listController,
        getTenantGroup,
        getChildrenByGroup,
        getParentGroup,
        getMyParentsSorted,
        addGroup,
        removeGroup,
        getSelectedGroup: () => selectedGroup,
        getSelectedBucket: () => selectedBucket,
        getGroupUsers,
        getParentUsersNotInChildGroup,
        removeUserFromGroup,
        addUserToGroup,
    });
};

const NoGroup = (() => { // one time creation, singleton
    const freeWaterForAll = Group();
    ALL_GROUP_ATTRIBUTE_NAMES.forEach(name => freeWaterForAll[name].setConvertedValue(""));
    return freeWaterForAll;
})();


