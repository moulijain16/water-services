import React from "react";

export default function ServiceHistory({ customer }) {
  const history = [...(customer.serviceHistory || [])].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div>
      <h3 className="font-semibold text-sm text-ink-700 mb-2">Service history</h3>
      {history.length === 0 ? (
        <p className="text-sm text-ink-500">No service visits logged yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {history.map((rec) => (
            <li key={rec._id} className="border-l-2 border-teal-200 pl-3">
              <span className="font-medium text-sm">{new Date(rec.date).toLocaleDateString()}</span>
              <p className="text-xs font-mono text-ink-700">₹{rec.chargedAmount}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}