export {generateTable, creatRowEntries}

// todo add i18n
const generateTableHead = (table, data) => {
    const keys = Object.keys(data)
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of keys) {
        let th = document.createElement("th");
        let text = document.createTextNode(data[key]);
        th.appendChild(text);
        row.appendChild(th);
    }
}

const generateTable = (table, data) => {
    // the first row is used to define the header
    generateTableHead(table, data[0])
    data.splice(0,1) // remove header row
    const tbody = table.createTBody();
    for (let element of data) {
        let row = tbody.insertRow();
        for (let key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }
    }
}


const creatRowEntries = table => {  // todo add guards (has head, has columns,...)
    const tbody = table.children[0];
    const thead = tbody.childNodes[0];
    const columns = tbody.childNodes[0].cells;

    let row = tbody.insertRow();

    let entries = [];

    for (let i = 0; i < columns.length; i++) {
        let cell = row.insertCell();
        let element = document.createElement("div");
        cell.appendChild(element);
        entries[entries.length] = element;
    }
    entries[entries.length] = row;  // append row to add row manipulations
    return entries;
}
