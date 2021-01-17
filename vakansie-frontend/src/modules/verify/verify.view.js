import {appendFirst, appendReplacing, appendsStyle} from "../../assets/util/appends.js";
import {dom} from "../../assets/util/dom.js";
import {calendarApprovalProjector, pageCss as pageCssMonth} from "./calendar.approval.projector.js";
import {i18n} from "../../service/translation.service.js";
import {appendRow, bindTableSearchListener, clearTableRows, creatRowEntries} from "../../service/table.service.js";
import {valueOf} from "../../base/presentationModel/presentationModel.js";
import {breadCrumbProjector} from "../groups/group.projector.js";


export {VerifyView};

// page-style change, only executed once
appendsStyle(pageCssMonth);

const masterClassName = 'approve-main-view'; // should be unique
const detailClassName = 'approve-detail-view'; // should be unique


/**
 * @param rootElement
 * @param  verifyCtrl {VerifyController}
 * @constructor
 */
const VerifyView = (rootElement, verifyCtrl) => {

    const render = () => {
        const planning = dom(`
            <div class="cards">
                <h1>this title will be changed by the translation service</h1>
                <div class="holder">
                    <div    id="masterContainer"></div>
                </div>
            </div>
            <div class="cards">
                <!--<h1 data-i18n="view.verify.title.details"></h1>-->
                <div class="holder" id="detailContainer"></div>
            </div>
        `)

        const title = planning.querySelector("h1"); // select first h1
        i18n('view.verify.title')(title);

        const masterContainer = planning.querySelector("#masterContainer");
        const detailContainer = planning.querySelector("#detailContainer");

        MasterView(masterContainer, verifyCtrl);
        DetailView(detailContainer, verifyCtrl);

        rootElement.textContent = '';
        appendFirst(rootElement)(planning)
    };

    render();
};

/**
 * @param rootElement
 * @param verifyCtrl {VerifyController}
 * @constructor
 */
const MasterView = (rootElement, verifyCtrl) => {

    const render = () => {
        const containerElement = dom(`
            <div id="${masterClassName}-details">
                <div id="${masterClassName}-details-calendar">
                    <div id="calendar" class="verify-detail-grid-container"></div> <!-- todo replace code for verify-detail-grid container left over -->
                </div>
                <div id="${masterClassName}-details-approvals">
                    <p>approve from to date</p>
                    <p>exclude user from approval</p>
                    <p>approve...</p>
                </div>
            </div>
        `)

        //const calendarElement = containerElement.querySelector(`#calendar`)
        const detailsCalendar = containerElement.querySelector(`#${masterClassName}-details-calendar`)
        const detailsApproval = containerElement.querySelector(`#${masterClassName}-details-approvals`)
        calendarApprovalProjector(detailsCalendar.children[0], verifyCtrl);
        appendFirst(rootElement)(containerElement)
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
 * @param approvalCtrl {VerifyController}
 * @constructor
 */
const DetailView = (rootElement, approvalCtrl) => {
    // render groups, users and rules to select / show
    // tables for groups, one for users, one for rules

    const groupContainerElement = dom(`
        <div id="${detailClassName}-details">
            <div id="${detailClassName}-details-groups"></div>
            <div id="${detailClassName}-details-users"></div>
            <div id="${detailClassName}-details-rules">
                <h2>Rules</h2>
                <form id="${detailClassName}-form">
                    <input type="text" id="${detailClassName}-myInput" placeholder="Search for rules...">
                </form>
                <table id="${detailClassName}-myTable">
                    <tr class="header">
                        <th style="width:80%;">Rule name</th>
                        <th style="width:20%;">active</th>
                    </tr>
                </table>
            </div>
        </div>
    `)

    const groupCtrl = approvalCtrl.getGroupCtrl();
    const selectedBucket = groupCtrl.getSelectedBucket();

    const detailsGroups = groupContainerElement.querySelector(`#${detailClassName}-details-groups`)
    const detailsUsers = groupContainerElement.querySelector(`#${detailClassName}-details-users`)
    detailsGroupsProjector(detailsGroups)(groupCtrl);
    selectedBucket.onModelSelected(group => detailsUsersProjector(detailsUsers)(group)(groupCtrl));

    appendReplacing(rootElement)(groupContainerElement);
};

const detailsGroupsProjector = rootElement => groupCtrl => {

    const detailsElement = dom(`
        <h2>Breadcrumb</h2>
        <form id="${detailClassName}-form">
            <input type="text" id="${detailClassName}-myInput" placeholder="Search for groups...">
        </form>
        <table id="${detailClassName}-myTable">
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

const detailsUsersProjector = rootElement => group => groupCtrl => {

    const detailElement = dom(`
        <h2>Users</h2>
        <form id="${detailClassName}-form">
            <input type="text" id="${detailClassName}-myInput" placeholder="Search for users...">
        </form>
        <table id="${detailClassName}-myTable">
            <tr class="header">
                <th style="width:80%;">User name</th>
                <th style="width:20%;">Approve</th>
            </tr>
        </table>
    `)

    const table = detailElement.querySelector("table");
    const search = detailElement.querySelector("#" + detailClassName + "-myInput");

    const groupUsers = groupCtrl.getGroupUsers(group).getAll();
    groupUsers.forEach(item => {
        const [userName, approve] = creatRowEntries(table);
        userName.textContent = valueOf(item.firstname);
        approve.innerHTML = "X"  // replace with checkbox
    })

    bindTableSearchListener(table)(search)(0) // name column = 1;
    appendReplacing(rootElement)(detailElement)
};


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


    #${detailClassName}-form {
        display: flex;
        flex-direction: row;
        width: 100%;
    }

    #${detailClassName}-myInput {
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

    #${detailClassName}-myTable {
      border-collapse: collapse; /* Collapse borders */
      width: 100%; /* Full-width */
      border: 1px solid #ddd; /* Add a grey border */
      font-size: 12px; /* Increase font-size */
    }

    #${detailClassName}-myTable th, #${detailClassName}-myTable td {
      text-align: left; /* Left-align text */
      padding: 12px; /* Add padding */
    }

    #${detailClassName}-myTable tr {
      /* Add a bottom border to all table rows */
      border-bottom: 1px solid #ddd;
    }

    #${detailClassName}-myTable tr.header, #${detailClassName}-myTable tr:hover {
      /* Add a grey background color to the table header and on hover */
      background-color: #f1f1f1;
    }
`;

appendsStyle(masterPageCss)
appendsStyle(detailPageCss)


