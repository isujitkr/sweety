// Highest, lowest, average (1 decimal) and count for a list of numbers.
// An empty list gives count 0 and null for the rest, so the UI can show an empty state.
function summarize(values) {
  const count = values.length;
  if (count === 0) {
    return { count: 0, highest: null, lowest: null, average: null };
  }
  const sum = values.reduce((total, v) => total + v, 0);
  return {
    count,
    highest: Math.max(...values),
    lowest: Math.min(...values),
    average: Math.round((sum / count) * 10) / 10,
  };
}

module.exports = { summarize };
