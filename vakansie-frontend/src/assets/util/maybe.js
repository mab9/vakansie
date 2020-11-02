export {maybe}

const maybe = cond => func => cond ? func() : ""
