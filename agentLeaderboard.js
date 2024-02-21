const supabase = require("./db.js");
const router = require("express").Router();
const axios = require("axios");

async function getLeaderboardMsUrl() {
    try {
        let serviceRegisterUrl =
        String(process.env.serviceRegistryUrl) + "/get-service";
        response = await axios.post(serviceRegisterUrl, {
        name: process.env.leaderboardMsName,
        });
        console.log(response.data);
    
        if (response.data.success) {
        return response.data.url;
        } else {
        console.log(response.data.message);
        return null;
        }
    } catch (error) {
        console.error("Error recovering leaderboard-data", error);
        return null;
    }
}

// send {id: , account_type: } in the request body
router.post("/", async (req, res) => {
    console.log("Hola");
    const leaderboardMsUrl = await getLeaderboardMsUrl();
    const leaderboardUrl = leaderboardMsUrl;

    console.log(leaderboardUrl);

    try {
        // get the unionId first
        
        const unionData = await supabase.any(`select "unionId" from "User" where "id" = $1;`, [req.body.id]);
        const unionId = unionData[0].unionId;

        // get upazillaId now
        const upazillaData = await supabase.any(`select "upazillaId" from "UnionParishad" where "id" = $1;`, [unionId]);
        const upazillaId = upazillaData[0].upazillaId;

        // now get the leaderboard of unions
        let unionLeaderboardUrl = leaderboardUrl + "/union";
        const unionLeaderboard = await axios.post(unionLeaderboardUrl, {
            upazilla_id: upazillaId,
        });

        // now get the leaderboard of farmers under the unionId
        let farmerLeaderboardUrl = leaderboardUrl + "/farmer";
        const farmerLeaderboard = await axios.post(farmerLeaderboardUrl, {
            union_id: unionId,
        });

        // now get the leaderboard of SMEs under the unionId
        let smeLeaderboardUrl = leaderboardUrl + "/sme";
        const smeLeaderboard = await axios.post(smeLeaderboardUrl, {
            union_id: unionId,
        });

        // now get the leaderboard of vendors under the unionId
        let vendorLeaderboardUrl = leaderboardUrl + "/vendor";
        const vendorLeaderboard = await axios.post(vendorLeaderboardUrl, {
            union_id: unionId,
        });

        let selfUnionRankUrl = leaderboardUrl + "/user-rank";
        const selfUnionRank = await axios.post(selfUnionRankUrl, {
            user_id: req.body.id,
            account_type: req.body.account_type,
            union_id: unionId,
        });

        const responseObj = {
            unionLeaderboard: unionLeaderboard.data,
            farmerLeaderboard: farmerLeaderboard.data,
            smeLeaderboard: smeLeaderboard.data,
            vendorLeaderboard: vendorLeaderboard.data,
            selfUnionRank: selfUnionRank.data,
        };

        console.log(responseObj);
        res.status(200).json(responseObj);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;