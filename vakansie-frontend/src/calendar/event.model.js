import {presentationModelFromAttributeNames, setValueOf,} from "../base/presentationModel/presentationModel.js";
import {ListController} from "../base/controller/controller.js";
import {UUID} from "../assets/util/uuid.js";

export {Event, ALL_EVENT_ATTRIBUTE_NAMES, EventStatus}

const EventStatus = {
    REQUESTED: 'REQUESTED',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    WITHDRAWN: 'WITHDRAWN',
}

/**
 * @typedef  Event
 * @type     {object}
 * @property {!number} id        - unique integer number; mandatory.
 * @property {date}    start     - date that is set once at the beginning and does not change. It indicates where
 *                                  the from to starts, is used to calc
 * @property {date}    from      - date that is equal or before the to date
 * @property {date}    to        - date that is equal or later as the from date
 * @property {number}  amount    - how many days off are between from and to date.
 * @property {Day[]}   days      - all days between from and to date including boundary.
 * @example  {id:0, from: 17.12.19, to: 17.12.22, amount: 3, day: [day1, day2]}
 */

const ALL_EVENT_ATTRIBUTE_NAMES = ['id', 'start', 'from', 'to', 'amount', 'days', 'approved', 'status'];

const Event = startDay => {      // facade
    let model = presentationModelFromAttributeNames(ALL_EVENT_ATTRIBUTE_NAMES);
    setValueOf(model.id)(UUID())
    setValueOf(model.start)(startDay);
    setValueOf(model.from)(startDay);
    setValueOf(model.to)(startDay);
    setValueOf(model.approved)(false); // will be replaced with status attribute
    setValueOf(model.status)(EventStatus.REQUESTED);
    const dayListCtrl = ListController()
    dayListCtrl.addModel(startDay);
    setValueOf(model.days)(dayListCtrl);
    return model;
}
