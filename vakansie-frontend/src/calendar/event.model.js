import {presentationModelFromAttributeNames, setValueOf,} from "../base/presentationModel/presentationModel.js";
import {ListController} from "../base/controller/controller.js";

export {Event, ALL_EVENT_ATTRIBUTE_NAMES}

/**
 * @typedef  Event
 * @type     {object}
 * @property {!number} id        - unique integer number; mandatory.
 * @property {date}    start     - date that is set once at the beginning and does not change. It indicates where
 *                                  the from to starts
 * @property {date}    from      - date that is equal or before the to date
 * @property {date}    to        - date that is equal or later as the from date
 * @property {number}  amount    - how many days off are between from and to date.
 * @property {Day[]}  days       - all days between from and to date including boundary.
 * @example  {id:0, from: 17.12.19, to: 17.12.22, amount: 3, day: [day1, day2]}
 */

const ALL_EVENT_ATTRIBUTE_NAMES = ['id', 'start', 'from', 'to', 'amount', 'days'];

const Event = startDay => {      // facade
    let model = presentationModelFromAttributeNames(ALL_EVENT_ATTRIBUTE_NAMES);
    setValueOf(model.id)(UUID())
    setValueOf(model.start)(startDay);
    setValueOf(model.from)(startDay);
    setValueOf(model.to)(startDay);
    const dayListCtrl = ListController()
    dayListCtrl.addModel(startDay);
    setValueOf(model.days)(dayListCtrl);
    return model;
}


const UUID = () => {
   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
   });
}
