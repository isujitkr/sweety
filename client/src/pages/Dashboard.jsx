import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import { formatDate, todayStr } from '../dates.js';
import ReadingForm from '../components/ReadingForm.jsx';
import ReadingList from '../components/ReadingList.jsx';
import ReportCard from '../components/ReportCard.jsx';

const REPORTS = [
  { key: 'daily', title: 'Daily report' },
  { key: 'month-to-date', title: 'Month-to-date report' },
  { key: 'monthly', title: 'Previous month report' },
];

export default function Dashboard({ user, onLogout }) {
  const [date, setDate] = useState(todayStr());
  const [reports, setReports] = useState({});
  const [errors, setErrors] = useState({});
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState('');

  const loadReports = useCallback(async () => {
    const results = await Promise.allSettled(REPORTS.map((r) => api.report(r.key, date)));
    const nextReports = {};
    const nextErrors = {};
    results.forEach((result, i) => {
      const key = REPORTS[i].key;
      if (result.status === 'fulfilled') nextReports[key] = result.value;
      else nextErrors[key] = result.reason.message;
    });
    setReports(nextReports);
    setErrors(nextErrors);
  }, [date]);

  useEffect(() => {
    setReports({});
    loadReports();
  }, [loadReports]);

  function handleSaved(savedDate) {
    setEditing(null);
    setNotice(editing ? 'Reading updated.' : 'Reading added.');
    if (savedDate !== date) setDate(savedDate);
    else loadReports();
  }

  async function handleDelete(reading) {
    if (!window.confirm(`Delete the ${reading.slotLabel} reading of ${reading.value} mg/dl?`)) {
      return;
    }
    try {
      await api.deleteReading(reading.id);
      if (editing && editing.id === reading.id) setEditing(null);
      setNotice('Reading deleted.');
      loadReports();
    } catch (err) {
      setErrors((prev) => ({ ...prev, daily: err.message }));
    }
  }

  function handleEdit(reading) {
    setNotice('');
    setEditing(reading);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="page">
      <header className="topbar">
        <h1 className="brand">Sweety</h1>
        <div className="who">
          <span>Hi, {user.name}</span>
          <button type="button" className="secondary small" onClick={onLogout}>
            Log out
          </button>
        </div>
      </header>

      <ReadingForm
        date={date}
        editing={editing}
        onSaved={handleSaved}
        onCancelEdit={() => setEditing(null)}
      />
      {notice && (
        <p className="notice" role="status">
          {notice}
        </p>
      )}

      <div className="date-picker card">
        <label>
          Show reports for
          <input
            type="date"
            value={date}
            max={todayStr()}
            onChange={(e) => e.target.value && setDate(e.target.value)}
          />
        </label>
        <span className="muted">{formatDate(date)}</span>
      </div>

      {REPORTS.map(({ key, title }) => (
        <ReportCard key={key} title={title} report={reports[key]} error={errors[key]}>
          {key === 'daily' && reports.daily && (
            <ReadingList
              readings={reports.daily.readings}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </ReportCard>
      ))}
    </div>
  );
}
