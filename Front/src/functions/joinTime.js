export default function renderJoinTime(str) {
    try {
        const timeString = str.toString();
        if (timeString.length !== 5) return "";
        const joinYear = timeString.substr(0, 4);
        const joinPeriod = timeString.substr(4, 1);
        switch (joinPeriod) {
            case "0":
                return "";
            case "1":
                return joinYear + "春招";
            case "2":
                return joinYear + "夏令营";
            case "3":
                return joinYear + "秋招";
        }
    } catch (e) {
        return "";
    }
}
