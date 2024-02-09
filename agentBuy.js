const supabase = require("./db.js");
const router = require("express").Router();
const axios = require("axios");

const buyMsUrl = process.env.buyMsUrl;

async function getBuyMsUrl() {
    try {
      let serviceRegisterUrl =
        String(process.env.serviceRegistryUrl) + "/get-service";
      response = await axios.post(serviceRegisterUrl, {
        name: process.env.buyMsName,
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

router.post("/history/farmer", async (req, res) => {
    try{
        const buyMsUrl = await getBuyMsUrl();
        if(buyMsUrl){
            let agent_id = req.body.id;
            const farmer_history = await axios.post(buyMsUrl + "/buy-history/agent/farmer", 
            {
                agent_id: agent_id,
            });
            res.status(200).json(farmer_history.data);
        }
        else{
            res.json({
                success: false,
                message: "Failed to get Buy MS URL",
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
        const buyMsUrl = await getBuyMsUrl();
        if(buyMsUrl){
            let agent_id = req.body.id;
            const sme_history = await axios.post(buyMsUrl + "/buy-history/agent/sme", 
            {
                agent_id: agent_id,
            });
            res.status(200).json(sme_history.data);
        }
        else{
            res.json({
                success: false,
                message: "Failed to get Buy MS URL",
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

router.post("/request/farmer", async (req, res) => {
    try{
        const buyMsUrl = await getBuyMsUrl();
        if(buyMsUrl){
            let agent_id = req.body.id;
            const farmer_request = await axios.post(buyMsUrl + "/buy-request/farmer", 
            {
                agent_id: agent_id,
            });
            res.status(200).json(farmer_request.data);
        }
        else{
            res.json({
                success: false,
                message: "Failed to get Buy MS URL",
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
        const buyMsUrl = await getBuyMsUrl();
        if(buyMsUrl){
            let agent_id = req.body.id;
            const sme_request = await axios.post(buyMsUrl + "/buy-request/sme", 
            {
                agent_id: agent_id,
            });
            res.status(200).json(sme_request.data);
        }
        else{
            res.json({
                success: false,
                message: "Failed to get Buy MS URL",
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

router.post("/request/info/farmer", async (req, res) => {
    try{
        const buyMsUrl = await getBuyMsUrl();
        if(buyMsUrl){
            let farmer_nid = req.body.farmer_nid;
            const farmer_info = await axios.post(buyMsUrl + "/buy-request/farmer/info", 
            {
                farmer_nid: farmer_nid,
            });
            res.status(200).json(farmer_info.data);
        }
        else{
            res.json({
                success: false,
                message: "Failed to get Buy MS URL",
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

router.post("/request/info/sme", async (req, res) => {
    try{
        const buyMsUrl = await getBuyMsUrl();
        if(buyMsUrl){
            let sme_nid = req.body.sme_nid;
            const sme_info = await axios.post(buyMsUrl + "/buy-request/sme/info", 
            {
                sme_nid: sme_nid,
            });
            res.status(200).json(sme_info.data);
        }
        else{
            res.json({
                success: false,
                message: "Failed to get Buy MS URL",
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

router.post("/request/submit/farmer", async (req, res) => {
    try{
        const buyMsUrl = await getBuyMsUrl();
        if(buyMsUrl){
            let { buyReq, buyItems } = req.body;
            // check buy MS for details. Just give famer nid instead of farmer id.
            let farmerNid = buyReq.farmerNid;

            let data = await supabase.any(`select "id" from "User" where "nid" = $1`, [farmerNid]);
            let farmerId = data[0].id;

            buyReq.farmerId = farmerId;

            const submission = await axios.post(buyMsUrl + "/buy-request/farmer/submit", 
            {
                buyReq: buyReq,
                buyItems: buyItems
            });
            res.status(200).json(submission.data);
        }
        else{
            res.json({
                success: false,
                message: "Failed to get Buy MS URL",
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
        const buyMsUrl = await getBuyMsUrl();
        if(buyMsUrl){
            let { buyReq, buyItems } = req.body;
            // check buy MS for details. Just give famer nid instead of farmer id.
            let smeNid = buyReq.smeNid;

            let data = await supabase.any(`select "id" from "User" where "nid" = $1`, [smeNid]);
            let smeId = data[0].id;

            buyReq.smeId = smeId;

            const submission = await axios.post(buyMsUrl + "/buy-request/sme/submit", 
            {
                buyReq: buyReq,
                buyItems: buyItems
            });
            res.status(200).json(submission.data);
        }
        else{
            res.json({
                success: false,
                message: "Failed to get Buy MS URL",
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