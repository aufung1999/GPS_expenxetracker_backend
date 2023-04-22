const Location = require("../models/location");
const User = require("../models/user");
const Bill = require("../models/bill");
const Statistic = require("../models/statistic");

//This is for "statistics" route
exports.getStatistics = async (req, res) => {
  const { email, get } = req.body;

  if (get) {
    const target_User = await User.findOne({ email: email });

    // console.log("target_User: " + target_User._id);

    const currentYear = new Date(Date.now())
      .toISOString()
      .split("T")[0]
      .substr(0, 4);
    // console.log("currentYear: " + currentYear);

    const currentMonth = new Date(Date.now())
      .toISOString()
      .split("T")[0]
      .substr(0, 7);

    const target_monthly_Statistics = await Statistic.find({
      $and: [
        {
          user: target_User,
        },
        { date: { $regex: currentMonth } },
      ],
    }).sort({ date: 1 });

    const target_Statistics = await Statistic.find({
      $and: [
        {
          user: target_User,
        },
        { date: { $regex: currentYear } },
      ],
    }).sort({ date: 1 });

    try {
      let daily_totalexpense = {};
      let dailyExpense = [];

      let totalexpenses = {
        [currentYear + "-01"]: 0,
        [currentYear + "-02"]: 0,
        [currentYear + "-03"]: 0,
        [currentYear + "-04"]: 0,
        [currentYear + "-05"]: 0,
        [currentYear + "-06"]: 0,
        [currentYear + "-07"]: 0,
        [currentYear + "-08"]: 0,
        [currentYear + "-09"]: 0,
        [currentYear + "-10"]: 0,
        [currentYear + "-11"]: 0,
        [currentYear + "-12"]: 0,
      };
      let monthExpenses = [];
      let annualExpense = [];

      for (const key in target_monthly_Statistics) {
        if (target_monthly_Statistics[key].date.substr(0, 7) === currentMonth) {
          // daily_totalexpense OBJECT contains the "target_monthly_Statistics[key].date" ~ "2023-04-22"
          if (
            Object.keys(daily_totalexpense).includes(
              target_monthly_Statistics[key].date
            )
          ) {
            Object.assign(daily_totalexpense, {
              [target_monthly_Statistics[key].date]:
              // "parseInt" is to make sure they are not add together s string, and as numbers
                parseInt(target_monthly_Statistics[key].expense) +
                parseInt(
                  daily_totalexpense[target_monthly_Statistics[key].date]
                ),
            });
          }

          if (
            Object.keys(daily_totalexpense).includes(
              target_monthly_Statistics[key].date
            ) === false
          ) {
            // dailyExpense.push(parseInt(target_monthly_Statistics[key].expense));
            Object.assign(daily_totalexpense, {
              [target_monthly_Statistics[key].date]: parseInt(
                target_monthly_Statistics[key].expense
              ),
            });
          }
        }
      }
      for (const key in target_Statistics) {
        if (target_Statistics[key].date.substr(0, 4) === currentYear) {
          monthExpenses.push(parseInt(target_Statistics[key].expense));
        }
        Object.assign(totalexpenses, {
          [target_Statistics[key].date.substr(0, 7)]: monthExpenses.reduce(
            (a, b) => a + b
          ),
        });
      }

      console.log(
        "dailyExpenses: " + JSON.stringify(daily_totalexpense, null, 1)
      );

      // console.log(
      //   "target_monthly_Statistics: " +
      //     JSON.stringify(target_monthly_Statistics, null, 1)
      // );
      // console.log("monthlyExpenses: " + JSON.stringify(totalexpenses, null, 1));

      return res.json({
        success: true,
        daily_expense: daily_totalexpense,
        monthly_expense: totalexpenses,
      });
    } catch (error) {
      res.json({ success: false, message: "FAILED to rerieve locations" });
    }
  }
};

exports.getDateExpenses = async (req, res, next) => {
  const { email, get, each_date } = req.body;

  console.log("each_date: " + each_date);

  if (get) {
    const target_User = await User.findOne({ email: email });
    const target_date_Statistics = await Statistic.find({
      $and: [
        {
          user: target_User,
        },
        { date: each_date },
      ],
    }).sort({ date: 1 });

    try {
      return res.json({
        success: true,
        date_expenses: target_date_Statistics,
      });
    } catch (error) {
      res.json({ success: false, message: "FAILED to rerieve locations" });
    }
  }
};

//This is for "store-expense" from "Locations" route
//This is for "bills" from "Bills" route
exports.updateStatistics = async (req, res, next) => {
  const { email, bill_exp, location_exp } = req.body;

  const target_User = await User.findOne({ email: email });

  console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
  console.log("bill_exp: " + bill_exp);
  console.log(bill_exp);
  console.log("location_exp: " + location_exp);
  console.log(location_exp);

  // // INITIALIZE if NOT in Statistic Collection
  // if (target_Statistic === undefined || null) {
  // come from the  "location"  side
  if (location_exp !== undefined) {
    //INSIDE the objects-array
    for (const key in location_exp) {
      const target_Location = await Location.findOne({ _id: key });

      const target_Statistic = await Statistic.findOne({
        user: target_User,
        location: target_Location,
      });

      if (target_Statistic) {
        await Statistic.updateOne(
          { _id: target_Statistic },
          { $set: { expense: location_exp[key] } }
        );
      } else {
        const save_Statistic = await Statistic({
          user: target_User,
          location: target_Location,
          name: target_Location.name,
          date: target_Location.date,
          expense: location_exp[key],
          place_id: target_Location.place_id,
        });

        await save_Statistic.save();
      }
    }
  }
  // come from the  "bill"  side
  if (bill_exp !== undefined) {
    //INSIDE the objects-array
    for (const key in bill_exp) {
      // const target_Statistic = await Statistic.findOne({ user: target_User });

      const target_Bill = await Bill.findOne({ _id: key });

      console.log("target_Bill: " + target_Bill);

      const save_Statistic = await Statistic({
        user: target_User,
        bill: target_Bill,
        name: target_Bill.bill,
        date: target_Bill.due_date,
        expense: target_Bill.bill_price,
      });
      await save_Statistic.save();
    }
  }

  console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
  next();
};
