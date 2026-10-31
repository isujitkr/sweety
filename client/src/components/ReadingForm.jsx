import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { SLOTS } from '../constants.js';
import { todayStr } from '../dates.js';

export default function ReadingForm({ date, editing, onSaved, onCancelEdit }) {
  const [slot, setSlot] = useState(SLOTS[0].value);
  const [value, setValue] = useState('');
  const [formDate, setFormDate] = useState(date);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (editing) {
      setSlot(editing.slot);
      setValue(String(editing.value));
      setFormDate(editing.date);
    } else {
      setValue('');
      setFormDate(date);
    }
    setError('');
  }, [editing, date]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    const body = { date: formDate, slot, value: value.trim() };
    try {
      if (editing) {
        await api.updateReading(editing.id, body);
      } else {
        await api.addReading(body);
      }
      setValue('');
      onSaved(formDate);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <h2>{editing ? 'Edit reading' : 'Add a reading'}</h2>

      <div className="row">
        <label>
          Date
          <input
            type="date"
            value={formDate}
            max={todayStr()}
            onChange={(e) => setFormDate(e.target.value)}
          />
        </label>
        <label>
          Time slot
          <select value={slot} onChange={(e) => setSlot(e.target.value)}>
            {SLOTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Glucose (mg/dl)
          <input
            inputMode="numeric"
            value={value}
            placeholder="e.g. 110"
            onChange={(e) => setValue(e.target.value)}
          />
        </label>
      </div>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <div className="actions">
        <button type="submit" disabled={busy}>
          {busy ? 'Saving…' : editing ? 'Save changes' : 'Add reading'}
        </button>
        {editing && (
          <button type="button" className="secondary" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
