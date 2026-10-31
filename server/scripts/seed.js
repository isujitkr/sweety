// Creates a demo user with ~45 days of sample readings.
//   Login: demo@sweety.app / demo1234
// Safe to run again: it resets the demo user's readings.
const bcrypt = require('bcryptjs');
const db = require('../src/db');
const { SLOTS } = require('../src/lib/validation');
const { todayStr } = require('../src/lib/dates');

const DEMO = { name: 'Demo Patient', email: 'demo@sweety.app', password: 'demo1234' };
const DAYS = 45;

// Typical value range per slot: [base, swing]
const RANGES = {
  morning: [105, 20],
  after_breakfast: [150, 35],
  after_lunch: [145, 35],
  after_dinner: [140, 35],
};

function dateDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return todayStr(d);
}

// Deterministic "random" so the seed gives the same data every time.
function wave(day, slotIndex) {
  return Math.sin(day * 12.9898 + slotIndex * 78.233);
}

async function main() {
  const hash = await bcrypt.hash(DEMO.password, 10);
  const { rows } = await db.query(
    `INSERT INTO users (name, email, password) VALUES ($1, $2, $3)
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, password = EXCLUDED.password
     RETURNING id`,
    [DEMO.name, DEMO.email, hash]
  );
  const userId = rows[0].id;

  await db.query('DELETE FROM readings WHERE user_id = $1', [userId]);

  let inserted = 0;
  for (let day = 0; day < DAYS; day++) {
    const date = dateDaysAgo(day);
    for (let i = 0; i < SLOTS.length; i++) {
      const w = wave(day, i);
      // Skip a few readings so some days are incomplete (today is always partial).
      const skip = (day === 0 && i > 1) || (day > 0 && w > 0.85);
      if (skip) continue;

      const [base, swing] = RANGES[SLOTS[i]];
      const value = Math.round(base + w * swing);
      await db.query(
        `INSERT INTO readings (user_id, reading_date, slot, value) VALUES ($1, $2, $3, $4)`,
        [userId, date, SLOTS[i], value]
      );
      inserted++;
    }
  }

  console.log(`Seeded ${inserted} readings for ${DEMO.email} (password: ${DEMO.password}).`);
}

main()
  .catch((err) => {
    console.error('Seeding failed:', err.message);
    process.exitCode = 1;
  })
  .finally(() => db.pool.end());
