const supabase = require("./db.js");
const router = require("express").Router();
const axios = require("axios");

const sellMsUrl = process.env.sellMsUrl;

async function getSellMsUrl() {
    try {
      let serviceRegisterUrl =
        String(process.env.serviceRegistryUrl) + "/get-service";
      response = await axios.post(serviceRegisterUrl, {
        name: process.env.sellMsName,
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

router.post("/history/vendor", async (req, res) => {
  try{
      const sellMsUrl = await getSellMsUrl();
      if(sellMsUrl){
          let agent_id = req.body.id;
          const vendor_history = await axios.post(sellMsUrl + "/sell-history/agent/vendor", 
          {
              agent_id: agent_id,
          });
          res.status(200).json(vendor_history.data);
      }
      else{
          res.json({
              success: false,
              message: "Failed to get Sell MS URL",
          });
      }
  }
  catch(error){
      console.error(error);
      res.json({
          success: false,
          message: "Internal Server Error",
      });
  }
});

router.post("/history/sme", async (req, res) => {
  try{
      const sellMsUrl = await getSellMsUrl();
      if(sellMsUrl){
          let agent_id = req.body.id;
          const sme_history = await axios.post(sellMsUrl + "/sell-history/agent/sme", 
          {
              agent_id: agent_id,
          });
          res.status(200).json(sme_history.data);
      }
      else{
          res.json({
              success: false,
              message: "Failed to get Sell MS URL",
          });
      }
  }
  catch(error){
      console.error(error);
      res.json({
          success: false,
          message: "Internal Server Error",
      });
  }
});

router.post("/request/vendor", async (req, res) => {
  try{
      const sellMsUrl = await getSellMsUrl();
      if(sellMsUrl){
          let agent_id = req.body.id;
          const vendor_request = await axios.post(sellMsUrl + "/sell-request/vendor", 
          {
              agent_id: agent_id,
          });
          res.status(200).json(vendor_request.data);
      }
      else{
          res.json({
              success: false,
              message: "Failed to get Sell MS URL",
          });
      }
  }
  catch(error){
      console.error(error);
      res.json({
          success: false,
          message: "Internal Server Error",
      });
  }
});

router.post("/request/sme", async (req, res) => {
  try{
      const sellMsUrl = await getSellMsUrl();
      if(sellMsUrl){
          let agent_id = req.body.id;
          const sme_request = await axios.post(sellMsUrl + "/sell-request/sme", 
          {
              agent_id: agent_id,
          });
          res.status(200).json(sme_request.data);
      }
      else{
          res.json({
              success: false,
              message: "Failed to get Sell MS URL",
          });
      }
  }
  catch(error){
      console.error(error);
      res.json({
          success: false,
          message: "Internal Server Error",
      });
  }
});

router.post("/request/submit/vendor", async (req, res) => {
  try{
      const sellMsUrl = await getSellMsUrl();
      if(sellMsUrl){
          let { sellReq, sellItems } = req.body;
          // check sell MS for details. Just give vendor nid instead of vendor id.
          let vendorNid = sellReq.vendorNid;

          let data = await supabase.any(`select "id" from "User" where "nid" = $1`, [vendorNid]);
          let vendorId = data[0].id;

          sellReq.vendorId = vendorId;

          const submission = await axios.post(sellMsUrl + "/sell-request/vendor/submit", 
          {
              sellReq: sellReq,
              sellItems: sellItems
          });
          res.status(200).json(submission.data);
      }
      else{
          res.json({
              success: false,
              message: "Failed to get Sell MS URL",
          });
      }
  }
  catch(error){
      console.error(error);
      res.json({
          success: false,
          message: "Internal Server Error",
      });
  }
});

router.post("/request/submit/sme", async (req, res) => {
  try{
      const sellMsUrl = await getSellMsUrl();
      if(sellMsUrl){
          let { sellReq, sellItems } = req.body;
          // check sell MS for details. Just give sme nid instead of sme id.
          let smeNid = sellReq.smeNid;

          let data = await supabase.any(`select "id" from "User" where "nid" = $1`, [smeNid]);
          let smeId = data[0].id;

          sellReq.smeId = smeId;

          const submission = await axios.post(sellMsUrl + "/sell-request/sme/submit", 
          {
              sellReq: sellReq,
              sellItems: sellItems
          });
          res.status(200).json(submission.data);
      }
      else{
          res.json({
              success: false,
              message: "Failed to get Sell MS URL",
          });
      }
  }
  catch(error){
      console.error(error);
      res.json({
          success: false,
          message: "Internal Server Error",
      });
  }
});

module.exports = router;