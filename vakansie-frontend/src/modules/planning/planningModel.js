import {
    presentationModelFromAttributeNames,
    VALUE
} from "../../base/presentationModel/presentationModel.js";

export { Day, ALL_DAY_ATTRIBUTE_NAMES}

/**
 * @typedef Day
 * @type     {object}
 * @property {!number} id        - unique integer number; mandatory.
 * @property {string}  date      - date in format yyyy.mm.dd; mandatory
 * @property {string}  day       - day from the date above format m without preceding 0; mandatory
 * @property {boolean} dayoff    - indicates if the day was selected as a day off
 * @property {number}  approved  - is day off approved: 0 = requested, 1 = approved, 2 = not approved; might be empty.
 * @example  {id:0, date: 20.20.20, day: 20, dayoff: true, approved: 1}
 */

const ALL_DAY_ATTRIBUTE_NAMES = ['id', 'date', 'day', 'dayoff', 'approved'];

// todo extend presentationmodel with differntiated label!
const Day = () => {      // facade
    return presentationModelFromAttributeNames(ALL_DAY_ATTRIBUTE_NAMES);
}
