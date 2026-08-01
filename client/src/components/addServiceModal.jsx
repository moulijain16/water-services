import React, { useState } from "react";
import { addServiceRecord } from "../services/api";

export default function AddServiceModal({ customer, onClose, onSaved }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    const chargedAmount = Number(amount);
    if (!amount || chargedAmount <= 0) {
      setError("Please enter the amount charged for this visit.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await addServiceRecord(customer._id, { date, chargedAmount });
      onSaved(res.data);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Could not save this visit.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-30 bg-ink-900/40 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Add Service — {customer.name}</h2>
          <button onClick={onClose} className="text-ink-500 hover:text-ink-900 text-xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm text-ink-700">
            Service date
            <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink-700">
            Amount charged *
            <input className="input" type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </label>
          {error && <p className="text-sm text-danger">{error}</p>}
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving..." : "Save visit"}
          </button>
        </form>
      </div>
    </div>
  );
}