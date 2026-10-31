import { formatRange } from '../dates.js';

function Stat({ label, value, unit }) {
  return (
    <div className="stat">
      <span className="stat-value">
        {value}
        {unit && <small> {unit}</small>}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export default function ReportCard({ title, report, error, children }) {
  return (
    <section className="card report">
      <header>
        <h2>{title}</h2>
        {report && <span className="range">{formatRange(report.from, report.to)}</span>}
      </header>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {!report && !error && <p className="muted">Loading…</p>}

      {report && report.summary.count === 0 && (
        <p className="empty">
          No readings for this period yet. Once you add some, your summary will show up here.
        </p>
      )}

      {report && report.summary.count > 0 && (
        <div className="stats">
          <Stat label="Highest" value={report.summary.highest} unit="mg/dl" />
          <Stat label="Lowest" value={report.summary.lowest} unit="mg/dl" />
          <Stat label="Average" value={report.summary.average.toFixed(1)} unit="mg/dl" />
          <Stat label="Readings" value={report.summary.count} />
        </div>
      )}

      {children}
    </section>
  );
}
