import {appendFirst} from "../../assets/util/appendFirst.js";
import {dom} from "../../assets/util/dom.js";
import "../../assets/util/times.js"
import {i18n} from "../../service/translationService.js";
import {id} from "../../assets/church/church.js";
import {generateTable} from "../../service/tableService.js";

export {planningProjector, pageCss}

const masterClassName = 'planning-master'; // should be unique for this projector
const detailClassName = 'planning-detail';

const months = ["month.jan","month.feb","month.mar","month.apr","month.mai","month.jul",
"month.jun","month.aug","month.sep","month.oct","month.nov","month.dez"];

const planningProjector = (rootElement) => {

    // 12 X 31 tabelle + headers  zeichnen
    // befüllen mit kalender taben, festtage, sa,so, etc

    //https://dev.to/knheidorn/making-a-calendar-in-vanilla-javascript-48j8

    const calendar = dom(`
        <h2> Planning Calendar </h2>
        <div class="${masterClassName}-table">
            <div class="${masterClassName}-head">
                <div class="${masterClassName}-cell">
                    <p>Month</p>
                </div>
                <div class="${masterClassName}-cell">
                    <p>1</p>
                </div>
                <div class="${masterClassName}-cell">
                    <p>2</p>
                </div>
            </div>
            <div class="${masterClassName}-row">
                <div class="${masterClassName}-cell">
                    <p>Januar</p>
                </div>
                <div class="${masterClassName}-cell">
                    <p>1</p>
                </div>
                <div class="${masterClassName}-cell">
                    <p>2</p>
                </div>
            </div>
            <div class="${masterClassName}-row">
                <div class="${masterClassName}-cell">
                    <p>Februar</p>
                </div>
                <div class="${masterClassName}-cell">
                    <p>1</p>
                </div>
                <div class="${masterClassName}-cell">
                    <p>2</p>
                </div>
            </div>
        </div>
    `)

    var d = new Date();
    var n = d.getFullYear();

    // const table = calendar.querySelector("#calendar");
    // const header = dom(`<div></div>`)
    // header.appendChild(dom(`<div>Month</div>`))
//
    // // stays here only that .times( ) is interpreted as function. Strange behaviour!!
    // const obsolete = 0;
    // (30).times((idx) => header.appendChild(dom(`<div>${idx + 1}</div>`)))
//
    // table.appendChild(header)

    appendFirst(rootElement)(calendar)
};

const pageCss = `
    .${masterClassName} {
        display:        grid;
        grid-column-gap: 0.5em;
        grid-template-columns: 1.7em auto auto; /* default: to be overridden dynamically */
        margin-bottom:  0.5em ;
    }
    .${detailClassName} {
        display:        grid;
        grid-column-gap: 0.5em;
        grid-template-columns: 1fr 3fr;
        margin-bottom:  0.5em ;
    }
    .${masterClassName}-table {
        display: table;
    }
    .${masterClassName}-head {
        display: table-row;
        font-weight: bold;
        text-align: center;
    }
    .${masterClassName}-row {
        display: table-row;
    }
    .${masterClassName}-cell {
        display: table-cell;
        border: solid;
        border-width: thin;
        padding-left: 5px;
        padding-right: 5px;
    }
`;
