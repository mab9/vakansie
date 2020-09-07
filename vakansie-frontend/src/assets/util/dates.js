// date utility

const dateFunction = function (date) {
    // guard
    if (!(date instanceof Date)) {
        throw new TypeError("Object is not a valid date");
    }

    const left = this;
    return left.getFullYear() === date.getFullYear() && left.getMonth() === date.getMonth() && left.getDate() === date.getDate();
};

Date.prototype.sameDay = dateFunction;
