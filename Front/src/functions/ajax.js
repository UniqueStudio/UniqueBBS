import axios from "axios";
const ajax = {
    async get(url, obj) {
        const token = localStorage.getItem("token");
        axios.defaults.headers.get["Authorization"] = token;
        return await axios.get(url, obj);
    },
    async post(url, obj) {
        const token = localStorage.getItem("token");
        axios.defaults.headers.post["Authorization"] = token;
        return await axios.post(url, obj);
    }
};

export default ajax;
