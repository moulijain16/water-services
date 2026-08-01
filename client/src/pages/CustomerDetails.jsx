import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import ServiceHistory from "../components/ServiceHistory";
import AddServiceModal from "../components/AddServiceModal";
import { fetchCustomerById } from "../services/api";

export default function CustomerDetails() {
  const { id } = useParams();
  const location = useLocation();
  const [customer, setCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(location.state?.message || "");

  useEffect(() => {
    fetchCustomerById(id).then((res) => setCustomer(res.data));
  }, [id]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  if (!customer) return <p className="p-4 text-sm text-ink-500">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      {toast && <div className="mb-4 rounded-lg bg-ok/10 text-ok text-sm px-3 py-2">{toast}</div>}

      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-semibold">{customer.name}</h1>
          <p className="text-sm text-ink-500">{customer.phone} · {customer.address}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowModal(true)} className="btn-primary">Add Service</button>
          <Link to={`/customers/${id}/edit`} className="bg-ink-900/5 hover:bg-ink-900/10 rounded-lg px-3 py-2 text-sm">
            Edit
          </Link>
        </div>
      </div>
      <ServiceHistory customer={customer} />
      {showModal && (
        <AddServiceModal
          customer={customer}
          onClose={() => setShowModal(false)}
          onSaved={(updated) => {
            setCustomer(updated);
            setToast("Service visit recorded successfully");
          }}
        />
      )}
    </div>
  );
}