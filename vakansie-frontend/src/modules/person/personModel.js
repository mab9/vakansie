import {presentationModelFromAttributeNames, VALUE} from "../../base/presentationModel/presentationModel.js";

export { Person, ALL_PERSON_ATTRIBUTE_NAMES}

/**
 * @typedef Person
 * @type     {object}
 * @property {!number} id        - unique integer number; mandatory.
 * @property {?string} img       - path to an image that displays the developer; optional.
 * @property {string}  firstname - might be empty.
 * @property {string}  lastname  - might be empty.
 * @property {string}  job       - might be empty.
 * @example  {id:0, img:"../../assets/img/avatars/018-gentleman.svg", firstname: "Marc-Antoine", lastname: "Bruelhart"}
 */

const ALL_PERSON_ATTRIBUTE_NAMES = ['id', 'img', 'firstname', 'lastname', 'job'];

const Person = () => {      // facade
    const person = presentationModelFromAttributeNames(ALL_PERSON_ATTRIBUTE_NAMES);

    // set empty job attribute to be able to use the converter and validator functions
    person['job'].getObs(VALUE).setValue("")
    person.job.setConverter(input => input.toUpperCase());
    person.job.setValidator(input => input.length >= 5);
    return person;
}
