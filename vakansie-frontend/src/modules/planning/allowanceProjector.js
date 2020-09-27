import {appendReplacing} from "../../assets/util/appendFirst.js";
import {dom} from "../../assets/util/dom.js";
import "../../assets/util/times.js"
import {VALUE, valueOf} from "../../base/presentationModel/presentationModel.js";
import "../../assets/util/dates.js"

export {allowanceProjector}

const detailClassName = 'planning-detail';


/**
 * @param  rootElement        {HTMLElement}
 * @param  planningController {PlanningController}
 */
const allowanceProjector = (rootElement, planningController) => {
    const holydays = planningController.getHolyDays();
    const fromToListCtrl = planningController.getFromToListController();

    const planning = dom(`
        <h2> Details Ferienkontingent</h2>
        <p>Ferientage dieses Jahr: <span>20</span></p>
        <p>Ferientage gebucht: <span>0</span></p>
        <p>Ferientage verbleibend: <span>0</span></p>
        <h2> Ferien von nach </h2>
        <div class="${detailClassName}-grid-container">
            <div>from</div><div>to</div><div>days</div><div>remove</div>
        </div>
    `)

    const span = planning.querySelectorAll("span")
    const ferienGebucht = span[1];
    const ferienVerbleibend = span[2];
    const container = planning.querySelector("div")

    holydays.getObs(VALUE).onChange(value => ferienVerbleibend.innerText = value)
    //listCtrl.onModelAdd(value => ferienGebucht.innerText = listCtrl.size())

    const createHolydayEntry = () => dom(`<div>start</div><div>stop</div><div>1</div><div><input type="button" value="X"> </div>`);


    /** @event fromTo {FromTo} */
    fromToListCtrl.onModelAdd(fromTo => {
        const entry = createHolydayEntry();
        let [start, end, days, remove] = entry.children;

        entry.childNodes.forEach(child => child.dataset.fromToId = valueOf(fromTo.id));
        start.innerText = valueOf(valueOf(fromTo.from).date).getFormated();
        end.innerText = valueOf(valueOf(fromTo.to).date).getFormated();
        container.appendChild(entry)

        fromTo.from.getObs(VALUE).onChange(day => {
            start.innerText = valueOf(day.date).getFormated();
            updateDaysBetween(days)(fromTo)
        });

        fromTo.to.getObs(VALUE).onChange(day => {
            end.innerText = valueOf(day.date).getFormated();
            updateDaysBetween(days)(fromTo)
        });

        remove.onclick = _ => {
            const elements = container.querySelectorAll(`[data-from-to-id="` + valueOf(fromTo.id) + `"]`);
            elements.forEach(element => element.remove())
        }
    })

    // todo highlight new entry  and de highlihgt when new entry is set!


    const updateDaysBetween = days => fromTo => {
        days.innerText = valueOf(valueOf(fromTo.from).date).daysBetween(valueOf(valueOf(fromTo.to).date)) + 1;
    }

    appendReplacing(rootElement)(planning);
}
