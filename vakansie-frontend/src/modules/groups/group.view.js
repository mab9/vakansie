import {appendFirst, appendReplacing, appendsStyle} from "../../assets/util/appends.js";
import {dom} from "../../assets/util/dom.js";
import {breadCrumbProjector, groupDetailsProjector, pageCss as pageCssGroup} from "./group.projector.js";
import {Attribute, onValueChange, setValueOf, valueOf} from "../../base/presentationModel/presentationModel.js";
import {Group} from "./group.model.js";
import {appendRow, bindTableSearchListener, clearTableRows, creatRowEntries} from "../../service/table.service.js";
import {maybe} from "../../assets/util/maybe.js";

export {GroupView};

// page-style change, only executed once
appendsStyle(pageCssGroup);

const masterClassName = 'group-main-view'; // should be unique
const detailClassName = 'group-detail-view'; // should be unique


/**
 * @param rootElement
 * @param  groupCtrl {GroupController}
 * @constructor
 */
const GroupView = (rootElement, groupCtrl) => {

    const selectionController = groupCtrl.getSelectedBucket();

    const render = () => {
        const groups = dom(`
            <div class="cards">
                <h1>this title will be changed by the translation service</h1>
                <div class="holder">
                    <div    id="masterContainer"></div>
                </div>
            </div>
            <div class="cards">
                <h1 data-i18n="Group details"></h1>
                <div class="holder" id="detailContainer"></div>
            </div>
        `)

        const title = groups.querySelector("h1"); // select first h1

        const masterContainer = groups.querySelector("#masterContainer");
        const detailContainer = groups.querySelector("#detailContainer");


        MasterView(masterContainer, groupCtrl);
        DetailView(detailContainer, selectionController, groupCtrl);

        //   // i18n('view.group.title')(title); todo make it i18n
        //   const tenantGroup = groupCtrl.getTenantGroup();
        //   title.innerText = "Groups and projects for tenant: " + valueOf(tenantGroup.name);
        title.innerText = "Groups and projects for tenant;";

        rootElement.textContent = '';
        appendFirst(rootElement)(groups)
    };

    render();
    groupCtrl.initGroups();
    // set initial bucket group
    const tenantGroup = groupCtrl.getTenantGroup();
    const selectedBucket = groupCtrl.getSelectedBucket();
    selectedBucket.setSelectedModel(tenantGroup);
};

/**
 * @param rootElement
 * @param groupCtrl {GroupController}
 * @constructor
 */
const MasterView = (rootElement, groupCtrl) => {

    const masterElement = dom(`
        <h2>Breadcrumb</h2>

        <form id="${masterClassName}-form">
            <input type="button" id="${masterClassName}-addGroup" value="+">
            <input type="text" id="${masterClassName}-myInput" placeholder="Search for groups...">
        </form>
        <table id="${masterClassName}-myTable">
          <tr class="header">
            <th style="width:15%;">Show childs</th>
            <th style="width:50%;">Name</th>
            <th style="width:15%;">Code</th>
            <th style="width:10%;">Project</th>
            <th style="width:10%;">Delete</th>
          </tr>
        </table>
    `)

    const breadcrumb = masterElement.querySelector("h2");
    const search = masterElement.querySelector("#" + masterClassName + "-myInput");
    const plus = masterElement.querySelector("#" + masterClassName + "-addGroup");
    const table = masterElement.querySelector("table");
    const listController = groupCtrl.getListController();
    const selectedBucket = groupCtrl.getSelectedBucket();
    const selectedGroup = groupCtrl.getSelectedGroup();

    plus.onclick = () => listController.addModel(Group(selectedBucket.getSelectedModel()));

    const renderListItem = group => {
        const row = appendRow(table)(`
          <tr>
           <td>x</td>
           <td>${valueOf(group.name)}</td>
           <td>${maybe(valueOf(group.name))(() => valueOf(group.name).substr(0, 3))}</td>
           <td>${valueOf(group.isProject)}</td>
           <td>x</td>
         </tr>`);

        /*
            We don't remove via listController to be able to update the child Ids of the parent group and
            to avoid memory leaks for each new bucket entries that are generated, on selected bucket changes
        */
        const deleteRow = () => {
            groupCtrl.removeGroup(group);
            table.deleteRow(row.rowIndex);
            selectedGroup.clearSelection();
        }

        const tds = row.querySelectorAll("td");
        row.onclick = _ => selectedGroup.setSelectedModel(group);
        tds[0].onclick = _ => selectedBucket.setSelectedModel(group);
        tds[4].onclick = _ => deleteRow();

        // todo create something more angular ng repeat like
        // todo check if possible to add later on the reference to an on click defiend function.
        // something like: <tr onclick="funny"> postReferences(row, funy);
        // something like regexmatcher  onclick="funny"  replace with defined function funny
    }

    selectedBucket.onModelSelected(group => {
        if (!group) return;
        clearTableRows(table);
        const groups = groupCtrl.getChildrenByGroup(selectedBucket.getSelectedModel());
        groups.forEach(renderListItem);
        breadCrumbProjector(groupCtrl, breadcrumb);
    })

    listController.onModelAdd(renderListItem);

    bindTableSearchListener(table)(search)(1) // name column = 1;
    appendReplacing(rootElement)(masterElement);
};

/**
 * @param rootElement
 * @param bucketSelectionCtrl {SelectionController}
 * @param groupCtrl {GroupController}
 * @constructor
 */
const DetailView = (rootElement, bucketSelectionCtrl, groupCtrl) => {

    const addUserElement = Attribute(false);

    const render = () => {
        if (!bucketSelectionCtrl.getSelectedModel()) return; // guard to prevent empty group at init time
        const group = bucketSelectionCtrl.getSelectedModel(); //getParentOrMyself(groupCtrl)(nextGroup)
        const isAddUserElement = valueOf(addUserElement);

        const containerElement = dom(`
            <div id="${detailClassName}-bucket-header">
            </div>

            <div id="${detailClassName}-bucket-detail">
                <form id="${detailClassName}-form">
                    <input type="button" id="${detailClassName}-addUser" value="${isAddUserElement ? '<' : '+'}">
                    <input type="text" id="${detailClassName}-myInput" placeholder="Search for users...">
                </form>
                <table id="${detailClassName}-myTable">
                    <tr class="header">
                        <th style="width:50%;">User name</th>
                        <th style="width:50%;">${isAddUserElement ? 'Add user' : 'Remove user'}</th>
                    </tr>
                </table>
            </div>
        `)

        const containerHeaderElement = containerElement.querySelector("#" + detailClassName + "-bucket-header");
        const table = containerElement.querySelector("table");
        const search = containerElement.querySelector("#" + detailClassName + "-myInput");
        const addUser = containerElement.querySelector("#" + detailClassName + "-addUser");
        addUser.onclick = () => setValueOf(addUserElement)(!valueOf(addUserElement));

        const groupUsers = isAddUserElement
            ? groupCtrl.getParentUsersNotInChildGroup(group)
            : groupCtrl.getGroupUsers(group).getAll();

        groupUsers.forEach(item => {
            const [userName, removeUser] = creatRowEntries(table);
            userName.textContent = valueOf(item.firstname);
            if (isAddUserElement) {
                removeUser.textContent = "+"
                removeUser.onclick = _ => {
                    groupCtrl.addUserToGroup(item)(group);
                    render()
                }
            } else {
                removeUser.textContent = "x";
                removeUser.onclick = _ => {
                    groupCtrl.removeUserFromGroup(item)(group);
                    render()
                }
            }
        })

        bindTableSearchListener(table)(search)(0) // name column = 1;
        groupDetailsProjector(containerHeaderElement)(group)
        appendReplacing(rootElement)(containerElement);
    }

    /** @type {ListController} */
    const groupListCtrl = groupCtrl.getListController();
    groupListCtrl.onModelRemove(_ => render());
    groupListCtrl.onModelAdd(_ => render());
    bucketSelectionCtrl.onModelSelected(_ => render());
    onValueChange(addUserElement)(_ => render());

};
