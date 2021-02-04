import {appendFirst, appendReplacing, appendsStyle} from "../../assets/util/appends.js";
import {dom} from "../../assets/util/dom.js";
import {calendarProjector} from "../../calendar/calendar.projector.js";
import {i18n} from "../../service/translation.service.js";
import {addRowHovering, appendRow, clearTableRows, creatRowEntries} from "../../service/table.service.js";
import {
    Attribute,
    EDITABLE,
    forEach,
    onHoverChange,
    setHoverOf,
    valueOf
} from "../../base/presentationModel/presentationModel.js";
import {breadCrumbProjector} from "../groups/group.projector.js";
import {ListController} from "../../base/controller/controller.js";
import {formItemProjector} from "../../projector/form.projector.js";
import {styleElement} from "../../assets/util/cssClasses.js";
import {tableProjector} from "../planning/table.projector.js";

export {ApprovalView};

// page-style change, only executed once
//appendsStyle(pageCssMonth);

const masterClassName = 'approve-main-view'; // should be unique
const detailClassName = 'approve-detail-view'; // should be unique


/**
 * @param rootElement
 * @param  approvalCtrl {ApprovalController}
 * @constructor
 */
const ApprovalView = (rootElement, approvalCtrl) => {

    const render = () => {
        const planning = dom(`
            <div class="cards">
                <h1>this title will be changed by the translation service</h1>
                <div class="holder">
                    <div    id="masterContainer"></div>
                </div>
            </div>
            <div class="cards">
                <!--<h1 data-i18n="view.approval.title.details"></h1>-->
                <div class="holder" id="detailContainer"></div>
            </div>
        `)

        const title = planning.querySelector("h1"); // select first h1
        i18n('view.approval.title')(title);

        const masterContainer = planning.querySelector("#masterContainer");
        const detailContainer = planning.querySelector("#detailContainer");

        MasterView(masterContainer, approvalCtrl);
        DetailView(detailContainer, approvalCtrl);

        rootElement.textContent = '';
        appendFirst(rootElement)(planning)
    };

    render();
};

/**
 * @param rootElement
 * @param approvalCtrl {ApprovalController}
 * @constructor
 */
const MasterView = (rootElement, approvalCtrl) => {

    const render = () => {
        const containerElement = dom(`
            <div id="${masterClassName}-details">
                <div id="${masterClassName}-details-calendar">
                    <div id="calendar" class="approval-detail-grid-container"></div> <!-- todo replace code for approval-detail-grid container left over -->
                </div>
                <div id="${masterClassName}-details-approvals">
                    <p>exclude user from approval</p>
                    <p></p>
                    <p></p>
                    <p></p>
                    <p></p>
                </div>
            </div>
        `)

        const detailsCalendar = containerElement.querySelector(`#${masterClassName}-details-calendar`)
        const detailsApproval = containerElement.querySelector(`#${masterClassName}-details-approvals`)
        calendarProjector(detailsCalendar.children[0], approvalCtrl, true);
        appendFirst(rootElement)(containerElement)

        const viewModelDetails = item => {
            return {
                model: item,
                employeesLeft: ["view.approval.label.employeesLeft", "checkbox"],
                approveBtn: ["view.approval.label.approve.btn", "button"],
                fromDate: ["view.approval.label.fromDate", "date"],
                toDate: ["view.approval.label.toDate", "date"],
            }
        }

        const model = approvalCtrl.getApprovalModel();
        const modelDetails = viewModelDetails(model)

        const [_, showEmployeesLeftElement, fromDateElement, toDateElement, approveElement] = detailsApproval.children;
        formItemProjector(showEmployeesLeftElement, 'employeesLeft', modelDetails)
        formItemProjector(fromDateElement, 'fromDate', modelDetails)
        formItemProjector(toDateElement, 'toDate', modelDetails)
        formItemProjector(approveElement, 'approveBtn', modelDetails)
        modelDetails.model.approveBtn.getObs(EDITABLE).setValue(false);
    }
    render();

    // todo impl :
    /*
        verfiy alnedar for tennant with calendar overview -> count how many users have vacation for a day
        choose a group and show vacations per day for the given group
        approve vacations from to date.
        approve vacations per user
        approve vacations per group
        approve vacations for all but one or two dudes.
     */
};

/**
 * @param rootElement
 * @param approvalCtrl {ApprovalController}
 * @constructor
 */
const DetailView = (rootElement, approvalCtrl) => {
    // render groups, users and rules to select / show
    // tables for groups, one for users, one for rules

    const groupContainerElement = dom(`
        <div id="${detailClassName}-details">
            <div id="${detailClassName}-details-groups"></div>
            <div id="${detailClassName}-details-users"></div>
            <div id="${detailClassName}-details-rules"></div>
        </div>
    `)

    const groupCtrl = approvalCtrl.getGroupCtrl();
    const eventListCtrl = approvalCtrl.getEventListCtrl();
    const selectedBucket = groupCtrl.getSelectedBucket();

    const detailsGroups = groupContainerElement.querySelector(`#${detailClassName}-details-groups`)
    const detailsUsers = groupContainerElement.querySelector(`#${detailClassName}-details-users`)
    const detailsRules = groupContainerElement.querySelector(`#${detailClassName}-details-rules`)

    detailsGroupsProjector(detailsGroups)(groupCtrl)(approvalCtrl);
    detailsUsersProjector(detailsUsers)(selectedBucket.getSelectedModel())(groupCtrl)(eventListCtrl)(approvalCtrl)
    detailsRulesProjector(detailsRules)(groupCtrl)(approvalCtrl);

    selectedBucket.onModelSelected(group => detailsUsersProjector(detailsUsers)(group)(groupCtrl)(eventListCtrl)(approvalCtrl));
    appendReplacing(rootElement)(groupContainerElement);
};

const detailsGroupsProjector = rootElement => groupCtrl => approvalCtrl => {

    const detailsElement = dom(`
        <h2>Breadcrumb</h2>
        <div style="width: 100%;"></div>
    `)

    const [breadcrumb, tableTarget] = detailsElement.children;

    const groupListCtrl = groupCtrl.getListController();
    const selectedBucket = groupCtrl.getSelectedBucket();

    const tableData = {
        target: tableTarget,
        props: {search: ["Search for Groups...", 1, false]},
        model: groupListCtrl
    }

    const renderTableHeader = `
          <tr class="header">
            <th style="width:10%;">Childs</th>
            <th style="width:80%;">Name</th>
            <th style="width:10%;">Project</th>
          </tr>
    `;

    const renderTableItem = (table, group) => {
        const row = appendRow(table)(`
          <tr>
           <td>x</td>
           <td>${valueOf(group.name)}</td>
           <td>${valueOf(group.isProject)}</td>
         </tr>`);

        const tds = row.querySelectorAll("td");
        tds[0].onclick = _ => selectedBucket.setSelectedModel(group);

        // style days on row hovering
        addRowHovering(row)( isHovered => {
            groupCtrl.getGroupUsers(group).forEach(user => {
                const userEvents2 = approvalCtrl.findUserEvents(valueOf(user.id));
                userEvents2.forEach(event => {
                    forEach(event.days)(day => setHoverOf(day.id)(isHovered))
                })
            })
        })

        // style row on day hovering
        groupCtrl.getGroupUsers(group).forEach(user => {
            const userEvents = approvalCtrl.findUserEvents(valueOf(user.id));
            userEvents.forEach(event => {
                forEach(event.days)(day => {
                    onHoverChange(day.event)(isHovered => styleElement(isHovered)("row-hovering")(row));
                })
            })
        })
    }

    tableProjector(tableData, renderTableHeader, renderTableItem)

    selectedBucket.onModelSelected(group => {
        if (!group) return;
        const table = tableTarget.querySelector("table")
        clearTableRows(table);
        const groups = groupCtrl.getChildrenByGroup(group);
        groups.forEach(item => renderTableItem(table, item));
        breadCrumbProjector(groupCtrl, breadcrumb);
    })

    groupListCtrl.onModelAdd(group => renderTableItem(tableTarget.querySelector("table"), group));
    groupCtrl.initGroups();
    selectedBucket.setSelectedModel(groupCtrl.getTenantGroup()) // default
    appendFirst(rootElement)(detailsElement);
}

const detailsUsersProjector = rootElement => group => groupCtrl => eventListCtrl => approvalCtrl => {

    const detailsElement = dom(`
        <h2>Users</h2>
        <div style="width: 100%;">
    `)

    const tableData = {
        target: detailsElement.children[1],
        props: {search: ["Search for Users...", 0, false]},
        model: groupCtrl.getGroupUsers(group)
    }

    const renderTableHeader = `
          <tr class="header">
              <th style="width:80%;">User name</th>
              <th style="width:20%;">exclude</th>
          </tr>
    `;

    const renderTableItem = (table, user) => {
        const [userName, approve, row] = creatRowEntries(table);
        userName.textContent = valueOf(user.firstname);
        approve.innerHTML = "X"  // replace with checkbox

        // style days on row hovering
        addRowHovering(row)( isHovered => {
            const userEvents2 = approvalCtrl.findUserEvents(valueOf(user.id));
            userEvents2.forEach(event => {
                forEach(event.days)(day => setHoverOf(day.id)(isHovered))
            })
        })

        // style row on day hovering
        const userEvents = approvalCtrl.findUserEvents(valueOf(user.id));
        userEvents.forEach(event => {
            forEach(event.days)(day => {
                onHoverChange(day.event)(isHovered => styleElement(isHovered)("row-hovering")(row));
            })
        })
    }

    tableProjector(tableData, renderTableHeader, renderTableItem)
    appendReplacing(rootElement)(detailsElement)
};

const detailsRulesProjector = rootElement => groupCtrl => approvalCtrl => {

    const detailsElement = dom(`
        <h2>Rules</h2>
        <div style="width: 100%;">
    `)

    // todo replace to rule component
    const ruleListCtrl = ListController();
    ruleListCtrl.addModel({
            name: Attribute("Min 1 available per day"),
            days: Attribute(ListController),
            active: Attribute(true)
        })
    ruleListCtrl.addModel({
            name: Attribute("Min 1 Architect per day"),
            days: Attribute(ListController),
            active: Attribute(true)
        })

    const tableData = {
        target: detailsElement.children[1],
        props: {search: ["Search for Rules...", 0, false]},
        model: ruleListCtrl
    }

    const renderTableHeader = `
          <tr class="header">
            <th style="width:80%;">Rule name</th>
            <th style="width:20%;">active</th>
          </tr>
    `;

    const renderTableItem = (table, item) => {
        const [name, active, row] = creatRowEntries(table);
        name.textContent = valueOf(item.name);
        active.innerHTML = "X"  // replace with checkbox

        addRowHovering(row)( isHovered => {
            // Is empty because we use the hidden style on hovering function
            // and no rules have been impl.
            // todo impl hover rules
        })
    }

    tableProjector(tableData, renderTableHeader, renderTableItem)
    appendFirst(rootElement)(detailsElement);
}

appendsStyle(`<style>
    * {
      box-sizing: border-box;
    }

    #${masterClassName}-details {
        display: flex;
        flex-direction: row;
        width: 100%;
    }

    #${masterClassName}-details-calendar {
        width: 60%;
    }


    #${masterClassName}-details-approvals {
        width: 37%;
        margin-left: 3%;
    }
</style>`);


appendsStyle(`<style>

    * {
      box-sizing: border-box;
    }

    #${detailClassName}-details {
        display: flex;
        flex-direction: row;
        width: 100%;
    }

    #${detailClassName}-details-groups {
        width: 30%;
    }

    #${detailClassName}-details-users {
        width: 30%;
        margin-left: 5%;
    }

    #${detailClassName}-details-rules {
        width: 30%;
        margin-left: 5%;
    }


    .${detailClassName}-form {
        display: flex;
        flex-direction: row;
        width: 100%;
    }
</style>`);
