const supabase = require("./db.js");
const router = require("express").Router();

async function processTaxData(farmerTax, smeTax) {
  // create a new object, with keys as month number and values as tax amount, summing up farmer and sme taxamount

  let taxData = {};
  for (let i = 0; i < farmerTax.length; i++) {
    const month = farmerTax[i].month_no;
    const taxAmount = farmerTax[i].taxamount;
    if (taxData[month]) {
      taxData[month] = parseFloat(taxData[month]) +  parseFloat(taxAmount);
    } else {
      taxData[month] = parseFloat(taxAmount);
    }
  }

  for (let i = 0; i < smeTax.length; i++) {
    const month = smeTax[i].month_no;
    const taxAmount = smeTax[i].taxamount;
    if (taxData[month]) {
      taxData[month] = parseFloat(taxData[month]) +  parseFloat(taxAmount);
    } else {
      taxData[month] = parseFloat(taxAmount);
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

  // now fill the missing month
  let currentMonth = new Date().getMonth() + 1;
  let currentYear = new Date().getFullYear();

  let monthYears = [];
  let last12Months = [];
  for (let i = 0; i < 12; i++) {
    last12Months.push(currentMonth);
    monthYears.push(currentYear);
    currentMonth--;
    if (currentMonth == 0) {
      currentMonth = 12;
      currentYear--;
    }
  }

  // now we have the last 12 months in sorted order
  // now we have to check if there is any missing month in the taxDataArray
  // if there is any missing month, then we have to add that month with 0 amount

  //  now iterate through the taxDataArray following the last12Months array, and add a field named amount as well as month name (Jan-24, Feb-24, Mar-24, ....)

  let last12MonthsIndex = 0;
  let last12MonthsLength = last12Months.length;

  // taxDataArrayReturned is the array that will be returned, it will contain the last 12 months data

  let taxDataArrayReturned = [];

  for (
    last12MonthsIndex = 0;
    last12MonthsIndex < last12MonthsLength;
    last12MonthsIndex++
  ) {
    let month_no = last12Months[last12MonthsIndex];

    // check if the month_no is present in the taxDataArray, if present, find the index and add the amount and month name with year in the taxDataArrayReturned array
    // if not present, add the month_no with 0 amount

    let found = false;
    for (
      let taxDataArrayIndex = 0;
      taxDataArrayIndex < taxDataArray.length;
      taxDataArrayIndex++
    ) {
      if (taxDataArray[taxDataArrayIndex].month_no == month_no) {
        // month_no is present in the taxDataArray
        found = true;
        taxDataArrayReturned.push({
          month:
            monthName[month_no - 1] +
            "-" +
            monthYears[last12MonthsIndex].toString().slice(2),
          taxAmount: taxDataArray[taxDataArrayIndex].taxAmount,
        });
        break;
      }
    }

    // if the month_no is not present in the taxDataArray, add the month_no with 0 amount
    if (!found) {
      taxDataArrayReturned.push({
        month:
          monthName[month_no - 1] +
          "-" +
          monthYears[last12MonthsIndex].toString().slice(2),
        taxAmount: 0,
      });
    }
  }

  // reverse the taxDataArrayReturned array
  taxDataArrayReturned.reverse();

  return taxDataArrayReturned;
}

router.post("/", async (req, res) => {
  let response = await supabase.any(
    `SELECT "name", "nid", "email", "phone", "avatarLink", "permanentAddress",  "dob",  (SELECT "name" AS "unionName" FROM "UnionParishad" where "UnionParishad"."id" = "unionId"), "unionId"\
    FROM "User" where "id" = $1;`,
    [req.body.id]
  );
  const basicDataTemp = response[0];
  const unionId = basicDataTemp.unionId;

  // basicData contains all the data except unionId
  const basicData = {
    name: basicDataTemp.name,
    nid: basicDataTemp.nid,
    email: basicDataTemp.email,
    phone: basicDataTemp.phone,
    avatarLink: basicDataTemp.avatarLink,
    permanentAddress: basicDataTemp.permanentAddress,
    dob: basicDataTemp.dob,
    unionName: basicDataTemp.unionName,
  };

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
