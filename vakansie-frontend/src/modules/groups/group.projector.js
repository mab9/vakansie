import {appendFirst, appendReplacing} from "../../assets/util/appends.js";
import {dom} from "../../assets/util/dom.js";
import "../../assets/util/times.js"
import {EDITABLE, onValueChange, valueOf} from "../../base/presentationModel/presentationModel.js";
import {formItemProjector, inputProjectorFixedValue, labelProjector} from "../../projector/form.projector.js";

export {groupDetailsProjector, breadCrumbProjector, pageCss}

const masterClassName = 'group-main-view'; // should be unique for this projector
const detailClassName = 'group-detail-view'; // should be unique for this projector


const breadCrumbProjector = (groupCtrl, breadcrumbElement) => {
    const selectedBucket = groupCtrl.getSelectedBucket();
    const brandNewBreadCrumb = dom(`<p></p>`)
    const list = brandNewBreadCrumb.querySelector("p");

    const appendGroup = group => {
        const element = dom(`<span>${valueOf(group.name)}</span>`)
        const entry = element.querySelector("span");
        onValueChange(group.name)(name => entry.innerHTML = name);
        entry.onclick = _ => selectedBucket.setSelectedModel(group)
        list.insertBefore(element, list.childNodes[0]);
    }

    appendGroup(selectedBucket.getSelectedModel());

    const sortedGroups = groupCtrl.getMyParentsSorted(selectedBucket.getSelectedModel());
    sortedGroups.slice().forEach(group => {
        // append separator
        list.insertBefore(dom(`<span> > </span>`), list.childNodes[0]);
        appendGroup(group);
    })

    appendReplacing(breadcrumbElement)(brandNewBreadCrumb);
}

const groupModelDetails = item => {
    return {
        model: item,
        name: ["view.group.detail.label.name", "text"],
        isProject: ["view.group.detail.label.isProject", "checkbox"],
        userIds: ["view.group.detail.label.userIds", "number"],
        ownerId: ["view.group.detail.label.ownerId", "text"],
    }
}

const groupDetailsProjector = rootElement => group => {

    const modelDetails = groupModelDetails(group); // init model

    const detailElement = dom(`
        <FORM style="width: 35%; margin-bottom: 20px; font-size: larger;">
            <DIV class="${detailClassName}">
            </DIV>
        </FORM>
    `)

    const detailFormElement = detailElement.querySelector("." + detailClassName);

    formItemProjector(detailFormElement, "name", modelDetails);
    formItemProjector(detailFormElement, "isProject", modelDetails);

    let attributeName = "userIds";
    detailFormElement.appendChild(labelProjector(attributeName)(modelDetails));
    detailFormElement.appendChild(inputProjectorFixedValue(valueOf(group.userIds).size())(attributeName)(modelDetails));
    group[attributeName].getObs(EDITABLE).setValue(false);
    // todo extend form projector with fixed value and list controller stuff

    attributeName = "ownerId";
    formItemProjector(detailFormElement, attributeName, modelDetails);
    group[attributeName].getObs(EDITABLE).setValue(false);
    // todo put and extedn editable to model detail object

    appendFirst(rootElement)(detailElement);
}




const pageCss = `

    * {
      box-sizing: border-box;
    }

    #${masterClassName}-form {
        display: flex;
        flex-direction: row;
    }

    #${masterClassName}-addGroup {
      display: block;
      text-align: center;
      width: 5%; /* Full-width */
      font-size: 16px; /* Increase font-size */
      padding: 12px 20px 12px 20px; /* Add some padding */
      border: 1px solid #ddd; /* Add a grey border */
      margin-bottom: 12px; /* Add some space below the input */
      margin-right: 12px; /* Add some space below the input */
    }

    #${masterClassName}-myInput {
      display: block;
      background-image: url('./src/assets/img/searchicon.png'); /* Add a search icon to input */
      background-position: 10px 12px; /* Position the search icon */
      background-repeat: no-repeat; /* Do not repeat the icon image */
      width: 100%; /* Full-width */
      font-size: 16px; /* Increase font-size */
      padding: 12px 20px 12px 40px; /* Add some padding */
      border: 1px solid #ddd; /* Add a grey border */
      margin-bottom: 12px; /* Add some space below the input */
    }

    #${masterClassName}-myTable {
      border-collapse: collapse; /* Collapse borders */
      width: 100%; /* Full-width */
      border: 1px solid #ddd; /* Add a grey border */
      font-size: 18px; /* Increase font-size */
    }

    #${masterClassName}-myTable th, #${masterClassName}-myTable td {
      text-align: left; /* Left-align text */
      padding: 12px; /* Add padding */
    }

    #${masterClassName}-myTable tr {
      /* Add a bottom border to all table rows */
      border-bottom: 1px solid #ddd;
    }

    #${masterClassName}-myTable tr.header, #${masterClassName}-myTable tr:hover {
      /* Add a grey background color to the table header and on hover */
      background-color: #f1f1f1;
    }


    #${detailClassName}-form {
        display: flex;
        flex-direction: row;
    }

    #${detailClassName}-addUser {
      display: block;
      text-align: center;
      width: 5%; /* Full-width */
      font-size: 16px; /* Increase font-size */
      padding: 12px 20px 12px 20px; /* Add some padding */
      border: 1px solid #ddd; /* Add a grey border */
      margin-bottom: 12px; /* Add some space below the input */
      margin-right: 12px; /* Add some space below the input */
    }

    #${detailClassName}-myInput {
      display: block;
      background-image: url('./src/assets/img/searchicon.png'); /* Add a search icon to input */
      background-position: 10px 12px; /* Position the search icon */
      background-repeat: no-repeat; /* Do not repeat the icon image */
      width: 95%; /* Full-width */
      font-size: 16px; /* Increase font-size */
      padding: 12px 20px 12px 40px; /* Add some padding */
      border: 1px solid #ddd; /* Add a grey border */
      margin-bottom: 12px; /* Add some space below the input */
    }

    #${detailClassName}-myTable {
      border-collapse: collapse; /* Collapse borders */
      width: 100%; /* Full-width */
      border: 1px solid #ddd; /* Add a grey border */
      font-size: 18px; /* Increase font-size */
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

    .${detailClassName} {
        display:        grid;
        grid-column-gap: 0.5em;
        grid-template-columns: 1fr 3fr;
        margin-bottom:  0.5em ;
    }
`;
