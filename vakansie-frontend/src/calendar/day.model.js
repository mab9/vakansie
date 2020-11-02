import {
    presentationModelFromAttributeNames,
    setHoverOf,
    setValueOf,
    valueOf
} from "../base/presentationModel/presentationModel.js";

export {Day, ALL_DAY_ATTRIBUTE_NAMES}

/**
 * @typedef Day
 * @type     {object}
 * @property {!number}  id           - unique integer number; mandatory.
 * @property {string}   date         - date in format yyyy.mm.dd; mandatory
 * @property {string}   day          - day from the date above format m without preceding 0; mandatory
 * @property {boolean}  holiday      - is day a holiday according the local calendar
 * @property {Event}    event        - reference to an event
 * @property {boolean}  isSelected   - indicates if the day is currently selected via gui or not
 * @property {Function} isEventDay   - is day that was selected as day off from the user. Is not a weekend day nor a holiday.
 * @property {Function} isWeekendDay -
 * @property {Function} isInMonth    - day is not a true natural date example: 30 february.
 * @property {Function} isHoliday    - is a holiday according the loaded holiday calendar
 * @property {Function} isNaturalDay - is a day that can be get as vacation day. A weekend day or a holiday is already off.
 * @property {Function} isBookable   - is a weekday that is not a holy day or a day that is already been booked
 * @property {Function} isDayOff     - is a day that is off. Can be a event day, weekend day or a holiday
 * @example  {id:0, date: 20.20.20, day: 20, dayoff: true, approved: 1, eventId: 1}
 */


const ALL_DAY_ATTRIBUTE_NAMES = ['id', 'date', 'day', 'holiday', 'event', 'isSelected'];

// todo extend presentationmodel with differntiated label!
const Day = () => {      // facade

    const model = presentationModelFromAttributeNames(ALL_DAY_ATTRIBUTE_NAMES);

    setValueOf(model.isSelected)(false); // default
    setHoverOf(model.event)(false); // default

    const isEventDay = () => !!valueOf(model.event);

    const isWeekendDay = () => valueOf(model.date).getDay() === 0 || valueOf(model.date).getDay() === 6;

    const isInMonth = () => valueOf(model.date).getDate() === valueOf(model.day);

    const isHoliday = () => valueOf(model.holiday)

    const isNaturalDay = () => isInMonth() && !(isWeekendDay() || isHoliday())

    const isBookable = () => isInMonth() && !(isWeekendDay() || isHoliday() || isEventDay());

    const isDayOff = () => isInMonth() && (isWeekendDay() || isHoliday() || isEventDay());

    return {
        isEventDay,
        isWeekendDay,
        isInMonth,
        isHoliday,
        isNaturalDay,
        isBookable,
        isDayOff,
        ...model,
    };
}
