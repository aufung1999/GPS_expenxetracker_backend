exports.dateDiffInDays = (a, b) => {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = new Date(a).getTime()
  // console.log('utc1: ' + utc1)
  const utc2 = new Date(b).getTime()
  console.log('utc2: ' + utc2)

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
};
