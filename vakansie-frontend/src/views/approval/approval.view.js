import {appendFirst, appendReplacing, appendsStyle} from "../../assets/util/appends.js";
import {dom} from "../../assets/util/dom.js";
import {calendarProjector, pageCss as pageCssMonth} from "../../calendar/calendar.projector.js";
import {i18n} from "../../service/translation.service.js";
import {appendRow, bindTableSearchListener, clearTableRows, creatRowEntries} from "../../service/table.service.js";
import {
    Attribute,
    EDITABLE,
    forEach,
    onHoverChange,
    onValueChange,
    setHoverOf,
    setValueOf,
    valueOf
} from "../../base/presentationModel/presentationModel.js";
import {breadCrumbProjector} from "../groups/group.projector.js";
import {ListController} from "../../base/controller/controller.js";
import {formItemProjector} from "../../projector/form.projector.js";
import {styleElement} from "../../assets/util/cssClasses.js";

export {ApprovalView};

// page-style change, only executed once
appendsStyle(pageCssMonth);

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
        <form class="${detailClassName}-form">
            <input type="text" class="${detailClassName}-myInput" placeholder="Search for groups...">
        </form>
        <table class="${detailClassName}-myTable">
          <tr class="header">
            <th style="width:10%;">Childs</th>
            <th style="width:80%;">Name</th>
            <th style="width:10%;">Project</th>
          </tr>
        </table>
    `)

    const [breadcrumb, form, table] = detailsElement.children;
    const [search] = form.children;

    const groupListCtrl = groupCtrl.getListController();
    const selectedBucket = groupCtrl.getSelectedBucket();

    const renderListItem = group => {
        const row = appendRow(table)(`
          <tr>
           <td>x</td>
           <td>${valueOf(group.name)}</td>
           <td>${valueOf(group.isProject)}</td>
         </tr>`);

        const tds = row.querySelectorAll("td");
        tds[0].onclick = _ => selectedBucket.setSelectedModel(group);

        const isHoverOnGroup = Attribute(false)
        row.onmouseover = _ => setValueOf(isHoverOnGroup)(true);
        row.onmouseleave = _ => setValueOf(isHoverOnGroup)(false);

        // style days on row hovering
        onValueChange(isHoverOnGroup)(isHovered => {
            styleElement(isHovered)("row-hovering")(row)

            const groupUsers2 = groupCtrl.getGroupUsers(group).getAll();
            groupUsers2.forEach(user => {
                const userEvents2 = approvalCtrl.findUserEvents(valueOf(user.id));
                userEvents2.forEach(event => {
                    forEach(event.days)(day => setHoverOf(day.id)(isHovered))
                })
            })
        })

        // style row on day hovering
        const groupUsers = groupCtrl.getGroupUsers(group).getAll();
        groupUsers.forEach(user => {
            const userEvents = approvalCtrl.findUserEvents(valueOf(user.id));
            userEvents.forEach(event => {
                forEach(event.days)(day => {
                    onHoverChange(day.event)(isHovered => styleElement(isHovered)("row-hovering")(row));
                })
            })
        })
    }

    selectedBucket.onModelSelected(group => {
        if (!group) return;
        clearTableRows(table);
        const groups = groupCtrl.getChildrenByGroup(selectedBucket.getSelectedModel());
        groups.forEach(renderListItem);
        breadCrumbProjector(groupCtrl, breadcrumb);
    })

    groupListCtrl.onModelAdd(renderListItem);
    groupCtrl.initGroups();
    selectedBucket.setSelectedModel(groupCtrl.getTenantGroup()) // default
    bindTableSearchListener(table)(search)(1) // name column = 1;
    appendFirst(rootElement)(detailsElement);
}

const detailsUsersProjector = rootElement => group => groupCtrl => eventListCtrl => approvalCtrl => {

    const detailElement = dom(`
        <h2>Users</h2>
        <form class="${detailClassName}-form">
            <input type="text" class="${detailClassName}-myInput" placeholder="Search for users...">
        </form>
        <table class="${detailClassName}-myTable">
            <tr class="header">
                <th style="width:80%;">User name</th>
                <th style="width:20%;">exclude</th>
            </tr>
        </table>
    `)

    const [_, form, table] = detailElement.children;
    const [search] = form.children;

    const groupUsers = groupCtrl.getGroupUsers(group).getAll();
    groupUsers.forEach(user => {

        const [userName, approve, row] = creatRowEntries(table);
        userName.textContent = valueOf(user.firstname);
        approve.innerHTML = "X"  // replace with checkbox

        const isHoverOnUser = Attribute(false)
        row.onmouseover = _ => setValueOf(isHoverOnUser)(true);
        row.onmouseleave = _ => setValueOf(isHoverOnUser)(false);

        // style days on row hovering
        onValueChange(isHoverOnUser)(isHovered => {
            styleElement(isHovered)("row-hovering")(row)
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
    })


    bindTableSearchListener(table)(search)(0) // name column = 1;
    appendReplacing(rootElement)(detailElement)
};

const detailsRulesProjector = rootElement => groupCtrl => approvalCtrl => {

    const detailElement = dom(`
        <h2>Rules</h2>
        <form class="${detailClassName}-form">
            <input type="text" class="${detailClassName}-myInput" placeholder="Search for rules...">
        </form>
        <table class="${detailClassName}-myTable">
            <tr class="header">
                <th style="width:80%;">Rule name</th>
                <th style="width:20%;">active</th>
            </tr>
        </table>
    `)

    const [_, form, table] = detailElement.children;
    const [search] = form.children;

    const rules = [
        {
            name: Attribute("Min 1 available per day"),
            days: Attribute(ListController),
            active: Attribute(true)
        },
        {
            name: Attribute("Min 1 Architect per day"),
            days: Attribute(ListController),
            active: Attribute(true)
        }];

    rules.forEach(item => {
        const [name, active, row] = creatRowEntries(table);
        name.textContent = valueOf(item.name);
        active.innerHTML = "X"  // replace with checkbox

        const isHowerOnRule = Attribute(false)
        row.onmouseover = _ => setValueOf(isHowerOnRule)(true);
        row.onmouseleave = _ => setValueOf(isHowerOnRule)(false);

        // style days on row hovering
        onValueChange(isHowerOnRule)(isHovered => {
            styleElement(isHovered)("row-hovering")(row)
        })

        // style days on row hovering  todo impl

    })

    bindTableSearchListener(table)(search)(0) // name column = 1;
    appendFirst(rootElement)(detailElement);
}

const masterPageCss = `
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

`;


const detailPageCss = `

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

    .${detailClassName}-myInput {
      display: block;
      background-image: url('./src/assets/img/searchicon.png'); /* Add a search icon to input */
      background-position: 10px 12px; /* Position the search icon */
      background-repeat: no-repeat; /* Do not repeat the icon image */
      width: 100%; /* Full-width */
      font-size: 12px; /* Increase font-size */
      padding: 12px 20px 12px 40px; /* Add some padding */
      border: 1px solid #ddd; /* Add a grey border */
      margin-bottom: 12px; /* Add some space below the input */
    }

    .${detailClassName}-myTable {
      border-collapse: collapse; /* Collapse borders */
      width: 100%; /* Full-width */
      border: 1px solid #ddd; /* Add a grey border */
      font-size: 12px; /* Increase font-size */
    }

    .${detailClassName}-myTable th, #${detailClassName}-myTable td {
      text-align: left; /* Left-align text */
      padding: 12px; /* Add padding */
    }

    .${detailClassName}-myTable tr {
      /* Add a bottom border to all table rows */
      border-bottom: 1px solid #ddd;
    }

    .${detailClassName}-myTable tr.header, #${detailClassName}-myTable tr:hover {
      /* Add a grey background color to the table header and on hover */
      background-color: #f1f1f1;
    }
`;

appendsStyle(masterPageCss)
appendsStyle(detailPageCss)
