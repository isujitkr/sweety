export default function ReadingList({ readings, onEdit, onDelete }) {
  if (readings.length === 0) return null;

  return (
    <ul className="readings">
      {readings.map((r) => (
        <li key={r.id}>
          <span className="slot">{r.slotLabel}</span>
          <span className="value">{r.value} mg/dl</span>
          <span className="buttons">
            <button type="button" className="secondary small" onClick={() => onEdit(r)}>
              Edit
            </button>
            <button type="button" className="danger small" onClick={() => onDelete(r)}>
              Delete
            </button>
          </span>
        </li>
      ))}
    </ul>
  );
}
