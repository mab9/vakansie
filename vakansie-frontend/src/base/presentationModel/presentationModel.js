import { Observable } from "../observable/observable.js";
import { id }         from "../../assets/church/church.js";

export { Attribute, presentationModelFromAttributeNames,
         VALID, VALUE, EDITABLE, LABEL, SELECTED, valueOf }

const VALUE    = "value";
const VALID    = "valid";
const EDITABLE = "editable";
const LABEL    = "label";
const SELECTED = "selected"


/**
 * @return Readonly {Attribute}
 * @constructor
 * @param value {String}
 */
const Attribute = value => {

    const observables = {};

    const hasObs = name => observables.hasOwnProperty(name);

    const getObs = (name, initValue = null) =>
        hasObs(name)
            ? observables[name]
            : observables[name] = Observable(initValue);

    getObs(VALUE, value); // initialize the value at least

    let   convert           = id ;
    const setConverter      = converter => {
        convert = converter;
        setConvertedValue(getObs(VALUE).getValue());
    };
    const setConvertedValue = val => getObs(VALUE).setValue(convert(val));

    // todo: this might set many validators without discharging old ones
    const setValidator = validate => getObs(VALUE).onChange( val => getObs(VALID).setValue(validate(val)));

    /**
     * @typedef Attribute
     */
    return Object.freeze( { getObs, hasObs, setValidator, setConverter, setConvertedValue })
};



/** Convenience function to read the current state of the attribute's VALUE observable for the given attribute. */
const valueOf = attribute => attribute.getObs(VALUE).getValue();

/** Creates Presentation Model with Attributes for each attribute name with VALUE and LABEL observables. */
const presentationModelFromAttributeNames = attributeNames => {
    const result = Object.create(null);
    attributeNames.forEach ( attributeName => {
        const attribute = Attribute(undefined);
        attribute.getObs(LABEL).setValue(attributeName); // default: use the attribute name as the label
        result[attributeName] = attribute;
    });
    return result;
};
