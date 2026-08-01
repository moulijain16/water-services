import React from "react";
import { Link } from "react-router-dom";

function daysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
}

export default function CustomerCard({ customer, onDelete, onAddService }) {
  const days = daysUntil(customer.nextServiceDate);
  let badge = { text: "Serviced", color: "bg-ok/10 text-ok" };
  if (days !== null) {
    if (days < 0) badge = { text: `${Math.abs(days)}d overdue`, color: "bg-danger/10 text-danger" };
    else if (days <= 7) badge = { text: `Due in ${days}d`, color: "bg-warn/10 text-warn" };
  }

  return (
    <div className="bg-white rounded-xl border border-ink-300/30 p-4 flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <Link to={`/customers/${customer._id}`} className="font-semibold text-ink-900 hover:underline">
          {customer.name}
        </Link>
        <div className="text-xs text-ink-500 mt-1">{customer.phone}</div>
        <div className="text-xs text-ink-500 truncate">{customer.address}</div>
        <span className={`inline-block mt-2 text-[11px] font-medium rounded-full px-2 py-0.5 ${badge.color}`}>
          {badge.text}
        </span>
        {!customer.isActive && (
          <span className="inline-block mt-2 ml-2 text-[11px] text-ink-300 border border-ink-300/40 rounded-full px-2 py-0.5">
            Inactive
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2 shrink-0">
        <button
          onClick={() => onAddService(customer)}
          className="text-xs bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-lg px-3 py-1.5"
        >
          Add Service
        </button>
        <Link
          to={`/customers/${customer._id}/edit`}
          className="text-xs bg-ink-900/5 hover:bg-ink-900/10 rounded-lg px-3 py-1.5 text-center"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(customer)}
          className="text-xs bg-danger/10 hover:bg-danger/20 text-danger rounded-lg px-3 py-1.5"
        >
          Delete
        </button>
      </div>
    </div>
  );
}