const axios = require("axios");

async function f() {
  axios.defaults.headers.get["Authorization"] =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJjanF4NTV4eHMwMDg3MDczMzE4bGMxZ2NqIiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNTQ3NTU5NTI1LCJleHAiOjE1NDc2NDU5MjV9.gWzVaznGX2Yl2h4dRDfNi5N30ptz5FMhVTPK7zmqNWE";
  const result = await axios.get("http://localhost:7010/user/my/info");
  console.log(result.data);
}

f();
