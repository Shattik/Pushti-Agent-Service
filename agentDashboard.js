const supabase = require("./db.js");
const router = require("express").Router();

async function processTaxData(farmerTax, smeTax) {
    // create a new object, with keys as month number and values as tax amount, summing up farmer and sme taxamount

    let taxData = {};
    for (let i = 0; i < farmerTax.length; i++) {
        const month = farmerTax[i].month_no;
        const taxAmount = farmerTax[i].taxamount;
        if (taxData[month]) {
            taxData[month] += taxAmount;
        } else {
            taxData[month] = taxAmount;
        }
    }

    for (let i = 0; i < smeTax.length; i++) {
        const month = smeTax[i].month_no;
        const taxAmount = smeTax[i].taxamount;
        if (taxData[month]) {
            taxData[month] += taxAmount;
        } else {
            taxData[month] = taxAmount;
        }
    }
    
    // convert the object to an array of objects
    let taxDataArray = [];
    for (const [key, value] of Object.entries(taxData)) {
        taxDataArray.push({ month_no: key, taxAmount: value });
    }

    // console.log(taxDataArray);
    // now replace month number with month name
    const monthName = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "July",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

    for (let i = 0; i < taxDataArray.length; i++) {
        const month = taxDataArray[i].month_no;
        taxDataArray[i].month = monthName[month - 1];
        delete taxDataArray[i].month_no;

    }

    return taxDataArray;

}

router.post("/", async (req, res) => {
  let response = await supabase.any(
    `SELECT "name", "nid", "email", "phone", "avatarLink", "permanentAddress",  "dob",  (SELECT "name" AS "unionName" FROM "UnionParishad" where "UnionParishad"."id" = "unionId"), "unionId"\
    FROM "User" where "id" = $1;`,
    [req.body.id]
  );
  const basicData = response[0];
  const unionId = basicData.unionId;

  let unionDetails = await supabase.any(
    `SELECT "name", "noFarmers", "noSme", "noVendors", "totalFarmerLoan", "totalSmeLoan", "totalBuy", "totalSell", "totalTax", "availableBudget"\
    FROM "UnionParishad"\
    WHERE "id" = $1;`,
    unionId
  );

  let farmerTax = await supabase.any(
    `SELECT EXTRACT('MONTH' FROM "timestamp") AS month_no, SUM("totalTax") as taxAmount\ 
    FROM "FarmerBuy"\ 
    where "agentId" = $1 and "timestamp" > NOW() - INTERVAL '1 year'\
    GROUP BY EXTRACT('MONTH' FROM "timestamp");`,
    [req.body.id]
  );

  let smeTax = await supabase.any(
    `SELECT EXTRACT('MONTH' FROM "timestamp") AS month_no, SUM("totalTax") as taxAmount\ 
    FROM "SmeBuy"\ 
    where "agentId" = $1 and "timestamp" > NOW() - INTERVAL '1 year'\
    GROUP BY EXTRACT('MONTH' FROM "timestamp");`,
    [req.body.id]
  );

  let taxData = await processTaxData(farmerTax, smeTax);

  const responseObj = { basicData, unionDetails, taxData };

  res.status(200).json(responseObj);
});

module.exports = router;
