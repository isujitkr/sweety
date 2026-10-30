const db = require("../db");
const { todayStr, isValidDateStr } = require('../lib/dates');
const {
  SLOTS,
  SLOT_LABELS,
  MAX_PER_DAY,
  maxPerDayMessage,
  duplicateSlotMessage,
  validateReading,
} = require('../lib/validation');


function toReading(row) {
  return {
    id: row.id,
    date: row.reading_date,
    slot: row.slot,
    slotLabel: SLOT_LABELS[row.slot],
    value: row.value,
  };
}

async function countForDay(userId, date, excludeId = null) {
  const { rows } = await db.query(
    `SELECT COUNT(*)::int AS n FROM readings
     WHERE user_id = $1 AND reading_date = $2 AND id IS DISTINCT FROM $3`,
    [userId, date, excludeId]
  );
  return rows[0].n;
}

async function slotTaken(userId, date, slot, excludeId = null) {
  const { rows } = await db.query(
    `SELECT 1 FROM readings
     WHERE user_id = $1 AND reading_date = $2 AND slot = $3 AND id IS DISTINCT FROM $4`,
    [userId, date, slot, excludeId]
  );
  return rows.length > 0;
}

const createReading = async (req, res, next) => {
    try {
        const { error, clean } = validateReading(req.body, todayStr());

        if (error) {
            return res.status(400).json({ success: false, error });
        }

        if ((await countForDay(req.userId, clean.date)) >= MAX_PER_DAY) {
            return res.status(409).json({
                success: false,
                error: maxPerDayMessage
            });
        }

        if (await slotTaken(req.userId, clean.date, clean.slot)) {
            return res.status(409).json({
                success: false,
                error: duplicateSlotMessage(clean.slot)
            });
        }

        const { rows } = await db.query(
            `INSERT INTO readings (user_id, reading_date, slot, value)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [req.user.id, clean.date, clean.slot, clean.value]
        );

        return res.status(201).json({
            success: true,
            reading: toReading(rows[0])
        });

    } catch (err) {
        if (err.code === "23505") {
            return res.status(409).json({
                success: false,
                error: duplicateSlotMessage(req.body.slot)
            });
        }

        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
};

module.exports = { createReading };