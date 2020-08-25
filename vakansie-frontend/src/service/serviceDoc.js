
import "../domainDoc.js"

/**
 * @callback onPersonsReadyCallback
 * @param    {Person[]} persons - array of persons
 * @return   {undefined} void
 */


/**
 * Common interface for all services (abstract factory pattern)
 *
 * @typedef {{loadPersons: (function(onPersonsReadyCallback): undefined)}} VakansieService
 * */
