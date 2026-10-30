const { isValidDateStr } = require('./dates');

const SLOT_LABELS = {
  morning: 'Morning (fasting)',
  after_breakfast: 'After breakfast',
  after_lunch: 'After lunch',
  after_dinner: 'After dinner',
};
const SLOTS = Object.keys(SLOT_LABELS);

const MIN_VALUE = 40;
const MAX_VALUE = 600;
const MAX_PER_DAY = 4;

function validateReading(input, today) {
  const { date, slot, value } = input || {};

  if (value === undefined || value === null || String(value).trim() === '') {
    return { error: 'Please enter a glucose value.' };
  }
  const num = Number(value);
  if (!Number.isInteger(num) || num < MIN_VALUE || num > MAX_VALUE) {
    return { error: `Value must be between ${MIN_VALUE} and ${MAX_VALUE} mg/dl.` };
  }
  if (!SLOTS.includes(slot)) {
    return { error: 'Please choose a correct time slot(morning, after_breakfast, after_lunch, after_dinner)' };
  }
  if (!isValidDateStr(date)) {
    return { error: 'Please choose a valid date(yyyy-mm-dd).' };
  }
  if (date > today) {
    return { error: 'Date cannot be in the future.' };
  }

  return { clean: { date, slot, value: num } };
}

const maxPerDayMessage = `You can add only ${MAX_PER_DAY} readings per day.`;

function duplicateSlotMessage(slot) {
  const label = SLOT_LABELS[slot];
  const article = /^[aeiou]/i.test(label) ? 'an' : 'a';
  return `You already have ${article} ${label} reading for this date.`;
}

module.exports = {
  maxPerDayMessage,
  duplicateSlotMessage,
  SLOTS,
  SLOT_LABELS,
  MIN_VALUE,
  MAX_VALUE,
  MAX_PER_DAY,
  validateReading,
};
