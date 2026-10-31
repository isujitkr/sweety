// Dates are 'YYYY-MM-DD' strings, same as the API.

export function todayStr() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

// function parts(str) {
//   const [y, m, d] = str.split('-').map(Number);
//   return new Date(y, m - 1, d);
// }

function parts(str) {
  if (!str || typeof str !== 'string') {
    return null;
  }

  const [y, m, d] = str.split('-').map(Number);

  return new Date(y, m - 1, d);
}

const day = { day: 'numeric', month: 'short' };
const full = { day: 'numeric', month: 'short', year: 'numeric' };

// "15 Oct 2026"
export function formatDate(str) {
  return parts(str).toLocaleDateString('en-GB', full);
}

// "1 Oct – 15 Oct 2026" (or a single date when from === to)
export function formatRange(from, to) {
  if (from === to) return formatDate(from);
  return `${parts(from).toLocaleDateString('en-GB', day)} – ${formatDate(to)}`;
}
