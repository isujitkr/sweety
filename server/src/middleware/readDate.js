const { isValidDateStr, todayStr } = require("../lib/dates");

const readDate = (req, res, next) => {
  const today = todayStr();
  const date = req.query.date === undefined ? today : req.query.date;
  if (!isValidDateStr(date)) {
    return res.status(400).json({ success: false, error: 'Please choose a valid date.' });
  }
  if (date > today) {
    return res.status(400).json({ sucess: false, error: 'Date cannot be in the future.' });
  }
  req.reportDate = date;
  next();
}

module.exports = readDate;