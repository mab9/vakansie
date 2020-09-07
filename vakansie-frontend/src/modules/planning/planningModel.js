import {
    presentationModelFromAttributeNames,
    VALUE, valueOf
} from "../../base/presentationModel/presentationModel.js";

export {Day, ALL_DAY_ATTRIBUTE_NAMES}

/**
 * @typedef Day
 * @type     {object}
 * @property {!number} id        - unique integer number; mandatory.
 * @property {string}  date      - date in format yyyy.mm.dd; mandatory
 * @property {string}  day       - day from the date above format m without preceding 0; mandatory
 * @property {boolean} dayoff    - indicates if the day was selected as a day off
 * @property {number}  approved  - is day off approved: 0 = requested, 1 = approved, 2 = not approved; might be empty.
 * @method isNotInMonth        - day is not a true natural date example: 30 february.
 * @example  {id:0, date: 20.20.20, day: 20, dayoff: true, approved: 1}
 */

const ALL_DAY_ATTRIBUTE_NAMES = ['id', 'date', 'day', 'dayoff', 'approved'];

// todo extend presentationmodel with differntiated label!
const Day = () => {      // facade

    const model = presentationModelFromAttributeNames(ALL_DAY_ATTRIBUTE_NAMES);

    const isWeekendDay = () => valueOf(model.date).getDay() === 0 || valueOf(model.date).getDay() === 6;

    const isNotInMonth = () => valueOf(model.date).getDate() !== valueOf(model.day);

    return {
        isNotInMonth,
        isWeekendDay,
        ... model,
    };
}
