export const getTodayFirstTimestamp = function(): Date {
    let date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    return date;
};
export const getTodayLastTimestamp = function(): Date {
    let date = new Date();
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    return date;
};
