import {appendsStyle} from "../../assets/util/appends.js";
import {dom} from "../../assets/util/dom.js";
import "../../assets/util/times.js"
import "../../assets/util/dates.js"
import {appendRow, bindTableSearchListener} from "../../service/table.service.js";

export {tableProjector}

// pre fix to keep it short
const pf = 'table-hit-man'; // should be unique for this projector

const tableProps = {
    search: [true, "Search for groups...", 0], // is activated, provide placeholder, search on column x
    style: undefined // provide custom table css
}

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

    .${tpf}-table td, .${tpf}-table th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
    }

    .${tpf}-table tr {
        border-bottom: 1px solid #ddd;
    }

    .${tpf}-table tr:nth-child(even) {
        background-color: #FEF387;
    }

    .${tpf}-table tr.header, .${tpf}-table tr:hover {
      background-color: #f1f1f1;
    }

    .row-hovering {
        border: 5px solid orange !important;
    }

    .${fpf}-form {
        display: flex !important;
        flex-direction: row !important;
        width: 100% !important;
    }

    .${fpf}-form input[type=text] {
        width: 100% !important;
        display: block !important;
        background-position: 10px 12px !important;
        background-repeat: no-repeat !important;
        font-size: 12px !important;
        padding: 12px 20px 12px 40px !important;
        border: 1px solid #ddd !important;
        margin-bottom: 12px !important;
    }

    .${fpf}-form input[type=button] {
      display: block;
      text-align: center;
      width: 5%;
      font-size: 16px;
      padding: 12px 12px;
      border: 1px solid #ddd;
      margin-bottom: 12px;
      margin-right: 12px;
    }

    </style>`);
}
