import React, { useState } from "react";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
  purifierModel: "",
  installationDate: "",
    lastServiceDate: "",
  notes: "",
  isActive: true,
};

export default function CustomerForm({ initialData, onSubmit, submitLabel }) {
  const [form, setForm] = useState(
    initialData
      ? {
          ...emptyForm,
          ...initialData,
          installationDate: initialData.installationDate ? initialData.installationDate.slice(0, 10) : "",
        }
      : emptyForm
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.phone || !form.address) {
  setError("Name, phone, and address are required.");
  return;
}
if (!/^[6-9]\d{9}$/.test(form.phone)) {
  setError("Enter a valid 10-digit phone number (starting with 6-9).");
  return;
}
    setSaving(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-lg">
      <Field label="Full name *">
        <input className="input" value={form.name} onChange={handleChange("name")} />
      </Field>
      <Field label="Phone *">
        <input className="input" value={form.phone} onChange={handleChange("phone")} />
      </Field>
      <Field label="Email">
        <input className="input" type="email" value={form.email} onChange={handleChange("email")} />
      </Field>
      <Field label="Address *">
        <textarea className="input" rows={2} value={form.address} onChange={handleChange("address")} />
      </Field>
      <Field label="Purifier model">
        <input className="input" value={form.purifierModel} onChange={handleChange("purifierModel")} />
      </Field>
      <Field label="Installation date">
  <input
    className="input"
    type="date"
    value={form.installationDate}
    onChange={handleChange("installationDate")}
  />
</Field>
{!initialData && (
  <Field label="Last service date (leave blank if never serviced before)">
    <input
      className="input"
      type="date"
      value={form.lastServiceDate}
      onChange={handleChange("lastServiceDate")}
    />
  </Field>
)}
      <Field label="Notes">
        <textarea className="input" rows={2} value={form.notes} onChange={handleChange("notes")} />
      </Field>
      {initialData && (
        <label className="flex items-center gap-2 text-sm text-ink-700">
          <input type="checkbox" checked={form.isActive} onChange={handleChange("isActive")} />
          Customer is active
        </label>
      )}
      {error && <p className="text-sm text-danger">{error}</p>}
      <button type="submit" disabled={saving} className="btn-primary">
        {saving ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1 text-sm text-ink-700">
      {label}
      {children}
    </label>
  );
}