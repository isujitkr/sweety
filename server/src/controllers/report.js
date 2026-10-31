const { SLOTS, SLOT_LABELS } = require("../lib/validation");
const db = require("../db");
const { summarize } = require("../lib/stats");
const { previousMonthRange, monthToDateRange } = require("../lib/dates");

async function buildReport(userId, type, from, to, includeReadings) {
  const { rows } = await db.query(
    `SELECT id, reading_date, slot, value FROM readings
     WHERE user_id = $1 AND reading_date BETWEEN $2 AND $3`,
    [userId, from, to],
  );

  const report = {
    type,
    from,
    to,
    summary: summarize(rows.map((r) => r.value)),
  };

  if (includeReadings) {
    report.readings = rows
      .sort((a, b) => SLOTS.indexOf(a.slot) - SLOTS.indexOf(b.slot))
      .map((r) => ({
        id: r.id,
        date: r.reading_date,
        slot: r.slot,
        slotLabel: SLOT_LABELS[r.slot],
        value: r.value,
      }));
  }
  return report;
}

const dailyReport = async (req, res) => {
  try {
    const date = req.reportDate;

    return res.status(200).json({
      success: true,
      message: await buildReport(req.user.id, "daily", date, date, true),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const monthToDateReport = async (req, res) => {
  try {
    const { from, to } = monthToDateRange(req.reportDate);
    return res.json({
      success: true,
      message: await buildReport(req.user.id, "month-to-date", from, to, false),
    });
  } catch (err) {
    return req.status(500).json({
        success: false,
        message: err.message
    })
  }
};

const monthlyReport = async (req, res) => {
  try {
    const { from, to } = previousMonthRange(req.reportDate);
    
    return res.json({success: true, message: await buildReport(req.user.id, "monthly", from, to, false)});
  } catch (err) {
    return res.status(500).json({
        success: false,
        message: err.message
    })
  }
};

module.exports = { dailyReport, monthToDateReport, monthlyReport };
