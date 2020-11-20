import {presentationModelFromAttributeNames, setValueOf,} from "../../base/presentationModel/presentationModel.js";
import {ListController} from "../../base/controller/controller.js";

export {Group, ALL_GROUP_ATTRIBUTE_NAMES}

/**
 * @typedef  Group
 * @type     {object}
 * @property {!number} id        - unique uuid; mandatory.
 * @property {!number} tenantId  - unique uuid; mandatory.
 * @property {!number} ownerId   - uuid of group creator; mandatory // todo user does not exist at the moment, create user model
 * @property {!string} name      - tenant unique group name; mandatory // todo user does not exist at the moment, create user model
 * @property {boolean} isTenant  - is a tenant group (has no parent)
 * @property {boolean} isProject - is a project group (contains only users)
 * @property {number[]} childIds - list of child group uuids;
 * @property {number[]} userIds  - list of group users;
 */

const ALL_GROUP_ATTRIBUTE_NAMES = ['id', 'tenantId', 'ownerId', 'name', 'isTenant', 'isProject', 'childIds', 'userIds'];

const Group = group => {      // facade
    let model = presentationModelFromAttributeNames(ALL_GROUP_ATTRIBUTE_NAMES);
    setValueOf(model.id)(group.id)
    setValueOf(model.tenantId)(group.tenantId)
    setValueOf(model.ownerId)(group.ownerId)
    setValueOf(model.name)(group.name);
    setValueOf(model.isTenant)(group.isTenant);   // is tenant and is project are false = normal group
    setValueOf(model.isProject)(group.isProject);

    const childs = ListController();
    group.childIds.forEach(childs.addModel)
    setValueOf(model.childIds)(childs);

    setValueOf(model.userIds)(ListController());   // todo populate users
    return model;
}
