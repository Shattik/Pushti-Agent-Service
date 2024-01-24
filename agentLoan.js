const supabase = require("./db.js");
const router = require("express").Router();
const axios = require("axios");

const loanMsUrl = process.env.loanMsUrl;

async function getLoanMsUrl() {
  try {
    let serviceRegisterUrl =
      String(process.env.serviceRegistryUrl) + "/get-service";
    response = await axios.post(serviceRegisterUrl, {
      name: process.env.loanMsName,
    });
    // console.log(response.data);

    if (response.data.success) {
      return response.data.url;
    } else {
      console.log(response.data.message);
      return null;
    }
  } catch (error) {
    console.error("Error recovering location-data", error);
    return null;
  }
}


module.exports = router;
