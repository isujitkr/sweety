const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function pad(n) {
  return String(n).padStart(2, '0');
}

function todayStr(now = new Date()) {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function isValidDateStr(value) {
  if (typeof value !== 'string' || !DATE_RE.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return (
    date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d
  );
}

function toStr(date) {
  return date.toISOString().slice(0, 10);
}

function monthToDateRange(dateStr) {
  return { from: `${dateStr.slice(0, 8)}01`, to: dateStr };
}

function previousMonthRange(dateStr) {
  const [y, m] = dateStr.split('-').map(Number);
  const first = new Date(Date.UTC(y, m - 2, 1));
  const last = new Date(Date.UTC(y, m - 1, 0));
  return { from: toStr(first), to: toStr(last) };
}

module.exports = { todayStr, isValidDateStr, monthToDateRange, previousMonthRange };
