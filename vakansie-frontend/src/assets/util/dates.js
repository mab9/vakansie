// date utility

const guardInstanceOfDate = date => {
    if (!(date instanceof Date)) {
        throw new TypeError("Object is not a valid date", date);
    }
}

const sameDay = function (date) {
    guardInstanceOfDate(date);

    const left = this;
    return left.getFullYear() === date.getFullYear() && left.getMonth() === date.getMonth() && left.getDate() === date.getDate();
};

const between = function (from, to) {
    guardInstanceOfDate(from);
    guardInstanceOfDate(to);

    const between = this;
    return between >= from && between <= to;
};


Date.prototype.sameDay = sameDay;
Date.prototype.between = between;
