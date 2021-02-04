import {appendsStyle} from "../../vakansie-frontend/src/assets/util/appends.js";
import {dom} from "../../vakansie-frontend/src/assets/util/dom.js";
import "../../vakansie-frontend/src/assets/util/times.js"
import "../../vakansie-frontend/src/assets/util/dates.js"
import {appendRow, bindTableSearchListener} from "../../vakansie-frontend/src/service/table.service.js";

export {tableProjector}

// pre fix to keep it short
const pf = 'table-hit-man'; // should be unique for this projector

/**
 * @param  tableData  {Object}
 * @param  headerRow {String}
 * @param  fnc {Function}
 */
const tableProjector = (tableData,  headerRow, fnc) => {
    let tableElement = dom(`<table class="${pf}-table"></table>`)
    const table = tableElement.querySelector("table");

    // create table header
    table.createTHead();
    appendRow(table)(headerRow)

    // add table data
    tableData.model.forEach(item => fnc(table, item));
    tableData.model.onModelAdd(item => fnc(table, item));

    const searchProps = tableData.props['search'];
    const styleProps = tableData.props['style']

    if (searchProps) appendTableSearch(table, searchProps);
    appendTableStyle(table, styleProps);

    tableData.target.appendChild(tableElement)
};

const appendTableSearch = (table, searchProps) => {
    // add prop to display button

    const element = dom(`
    <form class="${pf}-form">
        <input type="button" value="+">
        <input type="text" placeholder="${searchProps[0]}">
    </form>`);

    const [button, search] = element.children[0].children;
    const onClickFn = searchProps[2];
    if (onClickFn) {
         button.onclick = () => onClickFn();
    } else {
        element.children[0].removeChild(button);
    }

    bindTableSearchListener(table)(search)(searchProps[1])
    table.parentNode.insertBefore(element, table);
}

const appendTableStyle = (table, tableCss) => {

    if (tableCss) {
        appendsStyle(tableCss.style);
        return;
    }

    const tpf = pf;
    table.classList = tpf + "-table";


    const form = table.previousSibling;
    const fpf = "default-table-search-style";
    form.classList = fpf + "-form";


    appendsStyle(`<style>
    .button {
         margin-bottom:  0.5em ;
    }

    .${tpf}-table {
        border-collapse: collapse;
        width: 100%;
        font-size: 12px;
    }
    
    .${tpf}-table thead tr:first-child {
        border-bottom: 1px solid var(--c-secondary-1) !important;
    }

    .${tpf}-table td, .${tpf}-table th {
        text-align: left;
        padding: 8px;
    }

    .${tpf}-table tr {
        border-bottom: 1px solid var(--c-secondary-0);
    }

    .${tpf}-table tr.header, .${tpf}-table tr:hover {
      background-color: var(--c-secondary-0);
    }

    .${fpf}-form {
        width: 100%;
    }

    .${fpf}-form input[type=text] {
        width: 100%;
        font-size: 12px;
        padding: 8px;
        border: none;
        border-bottom: 1px solid var(--c-secondary-0);
        margin-bottom: 12px;
        outline:none;
    }
    
    .${fpf}-form input[type=text]:focus {
        border-bottom: 1px solid var(--c-secondary-1);
        transition: 400ms ease-out;
        align-content: center;
    }
    
    .fa-trash-alt {
        color: var(--c-secondary-1);
    }
    
    .fa-trash-alt:hover {
        color: var(--c-secondary-2);
    }
    
    </style>`);
}
