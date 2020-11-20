import {appendFirst} from "../../assets/util/appends.js";
import {dom} from "../../assets/util/dom.js";
import "../../assets/util/times.js"
import {valueOf} from "../../base/presentationModel/presentationModel.js";

export {groupProjector, pageCss}

const masterClassName = 'verify-master'; // should be unique for this projector

/**
 * @param  rootElement        {HTMLElement}
 * @param  groupCtrl          {GroupController}
 */
const groupProjector = (rootElement, groupCtrl) => {

    const groups = dom(`
        <h2> Groups (TENANT GROUP)</h2>

        <div class="${masterClassName}-main-group ${masterClassName}-card">
            <span>Main Groups</span>
            <ul></ul>
        </div>

        <div class="${masterClassName}-sub-group ${masterClassName}-card">
            <span>Child Groups</span>
            <ul></ul>
        </div>

        <div class="${masterClassName}-project-group ${masterClassName}-card">
            <span>Projects</span>
            <ul></ul>
        </div>

    `)

    const title = groups.querySelector("h2");
    const [mains, childs, projects] = groups.querySelectorAll("ul");

    const tenantGroup = groupCtrl.getTenantGroup();
    const allGroups = groupCtrl.getGroups();
    const projectGroups = groupCtrl.getProjectGroups();

    const childGroups = groupCtrl.getChildsByBroup(tenantGroup, false);


    childGroups.forEach(group => {
        mains.appendChild(dom(`<li>${valueOf(group.name)}</li>`))
    })

    projectGroups.forEach(group => {
        projects.appendChild(dom(`<li>${valueOf(group.name)}</li>`))
    })

    title.innerText = "Groups: " + valueOf(tenantGroup.name)
    // div breadcrump
    // div groups
    // div subgroups
    // div projects

    // detail view -> user list

    appendFirst(rootElement)(groups)
};




const pageCss = `

    * {
      box-sizing: border-box;
    }

    .${masterClassName}-card {
      float: left;
      width: 32.3%;
      box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
      transition: 0.3s;
      margin-left: 1%;
      padding: 5px;
      min-height: 200px;
    }

    .${masterClassName}-card:hover {
      box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
    }

`;
