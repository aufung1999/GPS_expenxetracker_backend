const Location = require("../models/location");
const User = require("../models/user");

exports.uploadLocation = async (req, res) => {
  //   console.log(req.body.location);
  // res.json({ success: true });
  const { place_id, location, viewport, name, count } = req.body.location; // deconstruct from REQUEST

  const target_User = await User.findOne({ email: req.body.email });

  const target_Location = await Location.findOne({
    user: target_User,
    place_id: place_id,
  });

  // if the locations NEVER exist in MONGODB
  if (target_Location == null) {
    const save_location = await Location({
      user: target_User,
      place_id: place_id,
      location: location,
      viewport: viewport,
      name: name,
      count: count,
      date: new Date(Date.now()).toISOString().split("T")[0],
    });

    await User.findOneAndUpdate(
      { email: req.body.email },
      { $push: { locations: save_location } }
    );

    await save_location.save();
    res.json({ success: true, save_location });
  }
  // if the locations exist in MONGODB
  else if (target_Location != null) {
    console.log("target_Location.count: " + target_Location.count);
    if (target_Location.count > count) {
      await Location.updateOne(
        { _id: target_Location },
        {
          $set: {
            count: target_Location.count + 1,
          },
        }
      );
    } else if (target_Location.count < count) {
      await Location.updateOne(
        { _id: target_Location },
        {
          $set: {
            count: count,
          },
        }
      );
    }
  }
};

exports.removeLocation = async (req, res) => {
  const { email, _id } = req.body;

  const target_User = await User.findOne({ email: email });

  try {
    await Location.deleteOne({
      user: target_User,
      _id: _id,
    });
    res.json({ success: true, message: "removed sucessfully" });
  } catch (error) {
    res.json({ success: false, message: "NOT removed" });
  }
};

exports.getLocations = async (req, res) => {
  console.log("***getLocations:***", req.body);

  const { email, dateRecord, switchRecord } = req.body;

  const target_User = await User.findOne({ email: email });

  try {
    if (switchRecord === "expense NOT recorded") {
      const target_Locations = await Location.find({ user: target_User }).sort({
        date: 1,
      });
      return res.json({ success: true, location: target_Locations });
    }

    if (switchRecord === "expense recorded" && dateRecord === "TODAY") {
      const today = new Date(Date.now()).toISOString().split("T")[0];
      const target_Locations = await Location.find({
        $and: [
          {
            user: target_User,
          },
          { date: { $regex: today } },
        ],
      }).sort({ date: 1 });

      console.log(target_Locations);
      return res.json({ success: true, location: target_Locations });
    }

    if (switchRecord === "expense recorded" && dateRecord === "1 MONTH") {
      const currentMonth = new Date(Date.now())
        .toISOString()
        .split("T")[0]
        .substr(0, 7);
      const target_Locations = await Location.find({
        $and: [
          {
            user: target_User,
          },
          { date: { $regex: currentMonth } },
        ],
      }).sort({ date: 1 });
      return res.json({ success: true, location: target_Locations });
    }

    if (switchRecord === "expense recorded" && dateRecord === "1 YEAR") {
      const currentYear = new Date(Date.now())
        .toISOString()
        .split("T")[0]
        .substr(0, 4);
      const target_Locations = await Location.find({
        $and: [
          {
            user: target_User,
          },
          { date: { $regex: currentYear } },
        ],
      }).sort({ date: 1 });
      return res.json({ success: true, location: target_Locations });
    }
  } catch (error) {
    res.json({ success: false, message: "FAILED to rerieve locations" });
  }
};

exports.storeExpense = async (req, res) => {
  console.log("***storeExpense:***", req.body);
  console.log("***_id:***", req.body.location_exp);

  const { email, location_exp } = req.body;

  const target_User = await User.findOne({ email: email });

  const target_Locations = await target_User["locations"].find((each) =>
    Object.keys(location_exp).includes(each._id.toString())
  );

  console.log("target_Locations: " + target_Locations);

  try {
    for (const key in location_exp) {
      await Location.updateOne(
        { _id: key },
        { $set: { expense: location_exp[key] } }
      );
    }

    res.json({ success: true, message: "Updated" });
  } catch (error) {
    // console.log('error: ' + error)
    res.json({ success: false, message: "CANNOT Update" });
  }
};
