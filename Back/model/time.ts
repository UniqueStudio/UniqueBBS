export const getTodayFirstTimestamp = function(date: Date): Date {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    return date;
};
export const getTodayLastTimestamp = function(date: Date): Date {
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    return date;
};