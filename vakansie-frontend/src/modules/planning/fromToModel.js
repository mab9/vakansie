import {
    presentationModelFromAttributeNames, valueOf, SELECTED
} from "../../base/presentationModel/presentationModel.js";

export {FromTo, ALL_FROM_TO_ATTRIBUTE_NAMES}

/**
 * @typedef  FromTo
 * @type     {object}
 * @property {!number} id        - unique integer number; mandatory.
 * @property {date}    start     - date that is set once at the beginning and does not change. It indicates where
 *                                  the from to starts
 * @property {date}    from      - date that is equal or before the to date
 * @property {date}    to        - date that is equal or later as the from date
 * @property {number}  amount    - how many days off are between from and to date.
 * @example  {id:0, from: 17.12.19, to: 17.12.22, amount: 3, day: [day1, day2]}
 */

const ALL_FROM_TO_ATTRIBUTE_NAMES = ['id', 'start', 'from', 'to', 'amount', 'days'];

const FromTo = () => {      // facade
    return  presentationModelFromAttributeNames(ALL_FROM_TO_ATTRIBUTE_NAMES);
}
