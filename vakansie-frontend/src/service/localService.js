export { vakansieService }

/** @type Person[] */
const persons = [
    {id:0, img:"../../assets/img/avatars/018-gentleman.svg", firstname: "Timothy", lastname: "McGee", job: "Software Engineer"},
    {id:1, img:"../../assets/img/avatars/010-student.svg", firstname: "Ziva", lastname: "David", job: "Business Analyst"},
    {id:2, img:"../../assets/img/avatars/024-viking.svg", firstname: "Anthony", lastname: "Dinozzo", job: "Product Owner"},
];

/**
 * Concrete factory for local {@link VakansieService} functions.
 * @constructor
 * @returns {VakansieService}
 */
const vakansieService = () => {
    const loadPersons = withPersons => withPersons(persons);
    return { loadPersons }
};
