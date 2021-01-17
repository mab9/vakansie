import {
    presentationModelFromAttributeNames,
    setValueOf,
    valueOf,
} from "../../base/presentationModel/presentationModel.js";
import {ListController} from "../../base/controller/controller.js";
import {UUID} from "../../assets/util/uuid.js";

export {Group, ALL_GROUP_ATTRIBUTE_NAMES}

/**
 * @typedef  Group
 * @type     {object}
 * @property {!number} id        - unique uuid; mandatory.
 * @property {!number} tenantId  - unique uuid; mandatory.
 * @property {!number} ownerId   - uuid of group creator; mandatory // todo user does not exist at the moment, create user model
 * @property {number}  parentId  - uuid of the parent groupd // empty if it is a tenant group // todo check if we remove the attribute isTenant.
 * @property {!string} name      - tenant unique group name; mandatory // todo user does not exist at the moment, create user model
 * @property {boolean} isTenant  - is a tenant group (has no parent)
 * @property {boolean} isProject - is a project group (contains only users)
 * @property {number[]} childIds - list of child group uuids;
 * @property {number[]} userIds  - list of group users;
 */

const ALL_GROUP_ATTRIBUTE_NAMES = ['id', 'tenantId', 'ownerId', 'parentId', 'name', 'isTenant', 'isProject', 'childIds', 'userIds'];

const Group = parentGroup => {      // facade
    let model = presentationModelFromAttributeNames(ALL_GROUP_ATTRIBUTE_NAMES);

        // defaults
    setValueOf(model.id)(UUID())
    setValueOf(model.isTenant)(false)
    setValueOf(model.name)("");
    setValueOf(model.isProject)(false);
    setValueOf(model.childIds)(ListController());
    setValueOf(model.userIds)(ListController());


    if (parentGroup) {
        setValueOf(model.parentId)(valueOf(parentGroup.id));
        const childrenListCtrl = valueOf(parentGroup.childIds)
        childrenListCtrl.addModel(valueOf(model.id));

        setValueOf(model.tenantId)(valueOf(parentGroup.tenantId))
        // todo use id from logged in user
        setValueOf(model.ownerId)(valueOf(parentGroup.ownerId))
    }


    return model;
}
