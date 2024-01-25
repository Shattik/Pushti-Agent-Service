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

router.post("/", async (req, res) => {
  try {
    const loanMsUrl = await getLoanMsUrl();
    if (loanMsUrl) {
      const request_farmers = await axios.post(
        loanMsUrl + "/loan_pending/farmer",
        {
          agent_id: req.body.id,
        }
      );

      const request_sme = await axios.post(loanMsUrl + "/loan_pending/sme", {
        agent_id: req.body.id,
      });

      const responseObj = {
        request_farmers: request_farmers.data,
        request_smes: request_sme.data,
      };
      // console.log(response.data);
      res.status(200).json(responseObj);
    } else {
      res.json({
        success: false,
        message: "Failed to get Loan MS URL",
      });
    }
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.post("/response/farmer/next", async (req, res) => {
  try {
    const loanMsUrl = await getLoanMsUrl();
    if (loanMsUrl) {
      const response = await axios.post(
        loanMsUrl + "/loan_response/farmer/next",
        {
          loan_id: req.body.loan_id,
        }
      );
      // console.log(response.data);
      res.status(200).json(response.data);
    } else {
      res.json({
        success: false,
        message: "Failed to get Loan MS URL",
      });
    }
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// do same for sme
router.post("/response/sme/next", async (req, res) => {
  try {
    const loanMsUrl = await getLoanMsUrl();
    if (loanMsUrl) {
      const response = await axios.post(loanMsUrl + "/loan_response/sme/next", {
        loan_id: req.body.loan_id,
      });
      // console.log(response.data);
      res.status(200).json(response.data);
    } else {
      res.json({
        success: false,
        message: "Failed to get Loan MS URL",
      });
    }
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// do same for farmer/reject and sme/reject
router.post("/response/farmer/reject", async (req, res) => {
  try {
    const loanMsUrl = await getLoanMsUrl();
    if (loanMsUrl) {
      const response = await axios.post(
        loanMsUrl + "/loan_response/farmer/reject",
        {
          loan_id: req.body.loan_id,
        }
      );
      // console.log(response.data);
      res.status(200).json(response.data);
    } else {
      res.json({
        success: false,
        message: "Failed to get Loan MS URL",
      });
    }
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.post("/response/sme/reject", async (req, res) => {
  try {
    const loanMsUrl = await getLoanMsUrl();
    if (loanMsUrl) {
      const response = await axios.post(
        loanMsUrl + "/loan_response/sme/reject",
        {
          loan_id: req.body.loan_id,
        }
      );
      // console.log(response.data);
      res.status(200).json(response.data);
    } else {
      res.json({
        success: false,
        message: "Failed to get Loan MS URL",
      });
    }
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// do same for farmer/accept and sme/accept
router.post("/response/farmer/accept", async (req, res) => {
  try {
    const loanMsUrl = await getLoanMsUrl();
    if (loanMsUrl) {
      const response = await axios.post(
        loanMsUrl + "/loan_response/farmer/accept",
        {
          loan_id: req.body.loan_id,
          amount: req.body.amount,
        }
      );
      // console.log(response.data);
      res.status(200).json(response.data);
    } else {
      res.json({
        success: false,
        message: "Failed to get Loan MS URL",
      });
    }
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.post("/response/sme/accept", async (req, res) => {
  try {
    const loanMsUrl = await getLoanMsUrl();
    if (loanMsUrl) {
      const response = await axios.post(
        loanMsUrl + "/loan_response/sme/accept",
        {
          loan_id: req.body.loan_id,
          amount: req.body.amount,
        }
      );
      // console.log(response.data);
      res.status(200).json(response.data);
    } else {
      res.json({
        success: false,
        message: "Failed to get Loan MS URL",
      });
    }
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
