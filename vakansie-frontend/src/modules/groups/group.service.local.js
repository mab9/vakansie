import {ListController} from "../../base/controller/controller.js";
import {UUID} from "../../assets/util/uuid.js";
import {ALL_PERSON_ATTRIBUTE_NAMES, Person} from "../person/person.model.js";
import {
    personService,
    uuidUser0,
    uuidUser1,
    uuidUser2,
    uuidUser3,
    uuidUser4,
    uuidUser5,
    uuidUser6,
    uuidUser7,
    uuidUser8,
    uuidUser9
} from "../person/person.service.local.js"
import {VALUE, valueOf} from "../../base/presentationModel/presentationModel.js";
import {id} from "../../assets/church/church.js"

export {groupService}

const uuidSie = UUID()
const uuidOwner = UUID();
const uuidJav = UUID()
const uuidArchitects = UUID();
const uuidDotNet = UUID();
const uuidBa = UUID();
const uuidBaSub1 = UUID();
const uuidBaSub2 = UUID();
const uuidSVV = UUID();

// tenant:     SIE
// groups:     JAV - .NET - Business Analysts
// projects:   SVV
// subgroups:  JAV Architects, Business Jav and .Net Analysts
const groupItems = [
    {id: uuidSie, tenantId: uuidSie, ownerId: uuidOwner, parentId: undefined, name: "SIE", isTenant: true, isProject: false, childIds: [uuidJav, uuidDotNet, uuidSVV, uuidBa], userIds: [uuidUser0, uuidUser1,uuidUser2, uuidUser3, uuidUser4, uuidUser5,uuidUser6, uuidUser7, uuidUser8, uuidUser9]},
    {id: uuidJav, tenantId: uuidSie, ownerId: uuidOwner, parentId: uuidSie, name: "JAV", isTenant: false, isProject: false, childIds: [uuidArchitects], userIds: [uuidUser1, uuidUser2, uuidUser3]},
    {id: uuidArchitects, tenantId: uuidSie, ownerId: uuidOwner, parentId: uuidJav, name: "Architects", isTenant: false, isProject: false, childIds: [], userIds: [uuidUser1, uuidUser3]},
    {id: uuidDotNet, tenantId: uuidSie, ownerId: uuidOwner, parentId: uuidSie, name: ".NET", isTenant: false, isProject: false, childIds: [], userIds: [uuidUser4, uuidUser5]},
    {id: uuidSVV, tenantId: uuidSie, ownerId: uuidOwner, parentId: uuidSie, name: "SVV", isTenant: false, isProject: true, childIds: [], userIds: [uuidUser2, uuidUser3, uuidUser4]},
    {id: uuidBa, tenantId: uuidSie, ownerId: uuidOwner, parentId: uuidSie, name: "Business Analysts", isTenant: false, isProject: false, childIds: [uuidBaSub1, uuidBaSub2], userIds: [uuidUser6, uuidUser7, uuidUser8, uuidUser9]},
    {id: uuidBaSub1, tenantId: uuidSie, ownerId: uuidOwner, parentId: uuidBa, name: "Business Jav Analysts", isTenant: false, isProject: false, childIds: [], userIds: [uuidUser8, uuidUser9]},
    {id: uuidBaSub2, tenantId: uuidSie, ownerId: uuidOwner, parentId: uuidBa, name: "Business .Net Analysts", isTenant: false, isProject: false, childIds: [], userIds: [uuidUser6, uuidUser7]},
]

/**
 * Concrete factory for local {@link GroupService} functions.
 * @constructor
 * @returns {GroupService}
 */
const groupService = () => { // one time creation, singleton

    const fetchGroups = () => {
        // deep copy to avoid modifying the list controller for userIds and childIds when using map.
        const deepCopy = JSON.parse(JSON.stringify(groupItems));
        return deepCopy.map(item =>{
            const userIdsListCtrl = ListController();
            item.userIds.forEach(userIdsListCtrl.addModel)
            item.userIds = userIdsListCtrl;

            const childIdsListCtrl = ListController();
            item.childIds.forEach(childIdsListCtrl.addModel)
            item.childIds = childIdsListCtrl;
            return item;
        });
    }

    const  fetchGroupUsers = groupId => groups => {
        const group = groups.find(item => valueOf(item.id) === groupId);
        const users = findAll(personService().loadPersons(id))(valueOf(group.userIds).getAll());
        const data = ListController();

        users.forEach(userData => {
            const person = Person();
            ALL_PERSON_ATTRIBUTE_NAMES.forEach(attribute => {
                person[attribute].getObs(VALUE).setValue(userData[attribute]);
            })
            data.addModel(person)
        })
        return data;
    }

    const findAll = items => ids => items.filter(item => ids.includes(item.id));

    return {
        loadGroups: () => fetchGroups(),
        loadGroupUsers: groupId => groups => fetchGroupUsers(groupId)(groups),
    }
};
