import {ListController} from "../../base/controller/controller.js";
import {UUID} from "../../assets/util/uuid.js";
import {Group} from "./group.model.js";

export {groupService}

const uuidSie = UUID()
const uuidOwner = UUID();
const uuidJav = UUID()
const uuidArchitects = UUID();
const uuidDotNet = UUID();
const uuidSVV = UUID();

const uuidUser0 = UUID();
const uuidUser1 = UUID();
const uuidUser2 = UUID();
const uuidUser3 = UUID();
const uuidUser4 = UUID();


const uuidUser5 = UUID();


const groups = [
    {id: uuidSie, tenantId: uuidSie, ownerId: uuidOwner, name: "SIE", isTenant: true, isProject: false, childIds: [uuidJav, uuidDotNet, uuidSVV], userIds: [uuidUser0, uuidUser1, uuidUser2, uuidUser3, uuidUser4, uuidUser5]},
    {id: uuidJav, tenantId: uuidSie, ownerId: uuidOwner, name: "JAV", isTenant: false, isProject: false, childIds: [uuidArchitects], userIds: [uuidUser1, uuidUser2, uuidUser3]},
    {id: uuidArchitects, tenantId: uuidSie, ownerId: uuidOwner, name: "Architects", isTenant: false, isProject: false, childIds: [], userIds: [uuidUser1, uuidUser3]},
    {id: uuidDotNet, tenantId: uuidSie, ownerId: uuidOwner, name: ".NET", isTenant: false, isProject: false, childIds: [], userIds: [uuidUser4, uuidUser5]},
    {id: uuidSVV, tenantId: uuidSie, ownerId: uuidOwner, name: "SVV", isTenant: false, isProject: true, childIds: [], userIds: [uuidUser2, uuidUser3, uuidUser4]},
]

// tenant:     SIE
// groups:     JAV - .NET
// projects:   SVV
// subgroups:  JAV Architects

const processGroups = groups => {
    const data = ListController();
    groups.forEach(group => {
        const newGroup = Group(group);
        data.addModel(newGroup)
    })
    return data;
}

/**
 * @typedef GroupService
 * @property {Function} getGroups
 */
const groupService = (() => { // one time creation, singleton

    return {
        getGroups: () => processGroups(groups),
    }
})();
