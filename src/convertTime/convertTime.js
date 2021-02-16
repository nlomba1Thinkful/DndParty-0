function convertTime(data, timezone) {
  data.map((singleData) => {
    let date = new Date(singleData.time_of_event).toString({
      timezone,
    });
    singleData.time_of_event = date;
    date = date.split(' ');
    singleData.day = date[0];
    singleData.month = date[1];
    singleData.date = parseInt(date[2], 10);
    singleData.year = date[3];
    date = new Date(singleData.time_of_event)
      .toLocaleString({
        timezone,
      })
      .split(' ');
    singleData.hour = date[1].split(':')[0];
    singleData.am = date[2];
  });
  return data;
}

module.exports = convertTime;
