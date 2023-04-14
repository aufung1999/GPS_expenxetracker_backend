// const Location = require("../models/location");
const User = require("../models/user");
const Bill = require("../models/bill");
const { dateDiffInDays } = require("../utilities/dateDiffInDays");
const { Current_Deadline } = require("../utilities/Current_Deadline");

//  -----------add Bill-----------
exports.addBill = async (req, res) => {
  console.log("req.body: " + JSON.stringify(req.body, null, 1));

  const { email } = req.body;
  //Usually, itt should be const, BUT as I need to do some conversion
  let { bill, bill_price, due_date, frequency } = req.body.billInfo; // deconstruct from REQUEST

  const target_User = await User.findOne({ email: email });

  const target_Bill = await Bill.findOne({
    // Find
    user: target_User,
    bill: bill,
    bill_price: bill_price,
    // due_date: due_date,      // needs to think about this One
    frequency: frequency,
  });

  if (target_Bill == null) {
    //To make up a "0" for integer LESS THAN 10
    if (parseInt(due_date) < 10) {
      due_date = "0" + due_date;
    }

    const { CurrentDate, Deadline } = Current_Deadline(
      "Initial date",
      due_date,
      frequency
    );

    // calculate the difference between Crrent and Deadline
    const difference = dateDiffInDays(CurrentDate, Deadline);

    //++++++++++++++++++++++++++++++++++++++++++++++++++++

    const save_bill = await Bill({
      user: target_User,
      bill: bill,
      bill_price: bill_price,
      due_date: Deadline,
      countDown_days: difference,
      frequency: frequency,
      due_status: "Not Today",
    });

    await User.findOneAndUpdate(
      { email: req.body.email },
      { $push: { bills: save_bill } }
    );

    await save_bill.save();
    res.json({ success: true, save_bill });
  } else if (target_Bill != null) {
    console.log("already here: ");
  }
};

//##########################################################################################################################################################################################################################################
// "countDown_days"
//  "due_date"
//  "due_status"
//  "total_expense"
exports.newRoundBills = async (req, res, next) => {
  if (req.body.bill_exp === undefined) {
    next();
  }
  if (req.body.bill_exp !== undefined) {
    console.log("req.body.bill_exp: " + req.body.bill_exp);
    //-----------------------------------------------------------

    const { email, bill_exp } = req.body;

    for (const _id in bill_exp) {
      if (bill_exp[_id] === true) {
        const target_Bill = await Bill.findOne({
          _id: _id,
        });

        const { CurrentDate, Deadline } = await Current_Deadline(
          "Recount date",
          target_Bill.due_date,
          target_Bill.frequency
        );

        const difference = await dateDiffInDays(CurrentDate, Deadline);

        // const due_date = target_Bill.due_date
        // const bill_price = target_Bill.bill_price

        await Bill.updateOne(
          {
            _id: _id,
            due_status: "Pay Today",
          },
          {
            $set: {
              countDown_days: difference,
              due_date: Deadline,
              due_status: "Not Today",
            //   total_expense: [{[due_date]:bill_price}],
            },
          }
        );
      }
    }
    //-----------------------------------------------------------
    next();
  }
};

//Mainly, UPDATE the
//  "countDown_days"
//  if-"due_status"
exports.updateBills = async (req, res, next) => {
  const { email } = req.body;
  const target_User = await User.findOne({ email: email });

  const target_Bills = await Bill.find({
    user: target_User,
  });

  try {
    target_Bills.map(async (each) => {
      console.log("each: " + each.due_date.substr(8, 10));
      // console.log("each: " + typeof numbers[each]);

      const { CurrentDate, Deadline } = Current_Deadline(
        "Update date",
        each.due_date,
        each.frequency
      );

      console.log("CurrentDate: " + CurrentDate);
      console.log("Deadline: " + Deadline);

      const difference = dateDiffInDays(CurrentDate, Deadline);

      console.log("difference: " + difference);

      if (difference === 0) {
        // hit the base case
        await Bill.updateOne(
          { _id: each },
          { $set: { due_status: "Pay Today" } }
        );
      }

      await Bill.updateOne(
        // no matter what the "countDown_days" WILL UPDATE
        { _id: each },
        { $set: { countDown_days: difference } }
      );
    });
    next();
    // res.json({ success: true, message: "Updated" });
  } catch (error) {
    // console.log('error: ' + error)
    res.json({ success: false, message: "CANNOT Update" });
  }
};

exports.getBills = async (req, res) => {
  const { email } = req.body;

  const target_User = await User.findOne({ email: email });

  try {
    const target_Bills = await Bill.find({
      user: target_User,
    }).sort({ countDown_days: 1 }); // This should be sorted by HOW close the date is to CURRENT Date

    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("target_Bills: " + target_Bills);

    return res.json({ success: true, location: target_Bills });
  } catch (error) {
    res.json({ success: false, message: "FAILED to GET BILLS" });
  }
};

//##########################################################################################################################################################################################################################################