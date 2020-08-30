export {generateTable}

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
