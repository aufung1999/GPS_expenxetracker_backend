exports.Current_Deadline = (statement, due_date, frequency) => {
  //create CUURENT date
  const CurrentDate = new Date(Date.now())
    .toISOString()
    .split("T")[0]
    .substr(0, 10);

  console.log(" due_date: " + due_date);
  //create a "DUE date" with "FREQUENCY" variable         --- TWO variables
  let timestamps;
  let Deadline;

  switch (statement) {
    case "Initial date":
      // This due_date is for the 1st time storeF
      timestamps = new Date(
        new Date(Date.now()).toISOString().split("T")[0].substr(0, 8) + due_date
      );
      Deadline = new Date(
        timestamps.setMonth(timestamps.getMonth() + frequency)
      )
        .toISOString()
        .split("T")[0]
        .substr(0, 10);
      break;
    case "Update date":
      // For the later update, This does not need "frequency",
      //and the "date" changes a lil bitF
      timestamps = new Date(due_date);
      Deadline = new Date(timestamps).toISOString().split("T")[0].substr(0, 10);
      break;
    case "Recount date":
      timestamps = new Date(due_date);
      Deadline = new Date(
        timestamps.setMonth(timestamps.getMonth() + frequency)
      )
        .toISOString()
        .split("T")[0]
        .substr(0, 10);
      break;
  }

  return {
    CurrentDate: CurrentDate,
    Deadline: Deadline,
  };
};
