import React, { useEffect, useState, useCallback } from "react";
import SearchBar from "../components/SearchBar";
import CustomerCard from "../components/CustomerCard";
import AddServiceModal from "../components/AddServiceModal";
import { fetchCustomers, deleteCustomer } from "../services/api";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const [serviceCustomer, setServiceCustomer] = useState(null);
  const [toast, setToast] = useState("");

  const loadCustomers = useCallback(() => {
    setLoading(true);
    setLoadError("");
    const params = {};
    if (search) params.search = search;
    if (statusFilter !== "all") params.status = statusFilter;
    fetchCustomers(params)
      .then((res) => setCustomers(res.data))
      .catch(() => setLoadError("Couldn't reach the server. Check your connection and try again."))
      .finally(() => setLoading(false));
  }, [search, statusFilter]);

  useEffect(() => {
    const timeout = setTimeout(loadCustomers, 300);
    return () => clearTimeout(timeout);
  }, [loadCustomers]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleDelete = async () => {
    try {
      await deleteCustomer(toDelete._id);
      setToDelete(null);
      setToast("Customer deleted successfully");
      loadCustomers();
    } catch {
      setToDelete(null);
      setToast("Could not delete customer. Try again.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Customers</h1>

      {toast && (
        <div className="mb-4 rounded-lg bg-ok/10 text-ok text-sm px-3 py-2">{toast}</div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1"><SearchBar value={search} onChange={setSearch} /></div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input sm:w-48">
          <option value="all">All customers</option>
          <option value="due">Due for service</option>
          <option value="active">Active only</option>
          <option value="inactive">Inactive only</option>
        </select>
      </div>

      {loadError ? (
        <div className="text-center py-10">
          <p className="text-sm text-danger mb-3">{loadError}</p>
          <button onClick={loadCustomers} className="btn-primary inline-block px-4">Retry</button>
        </div>
      ) : loading ? (
        <p className="text-sm text-ink-500">Loading...</p>
      ) : customers.length === 0 ? (
        <p className="text-sm text-ink-500">No customers found.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {customers.map((c) => (
            <CustomerCard key={c._id} customer={c} onDelete={setToDelete} onAddService={setServiceCustomer} />
          ))}
        </div>
      )}

      {toDelete && (
        <div className="fixed inset-0 bg-ink-900/40 flex items-center justify-center p-4 z-30">
          <div className="bg-white rounded-xl p-5 max-w-sm w-full">
            <p className="text-sm mb-4">Delete {toDelete.name}? This removes their full service history too.</p>
            <div className="flex gap-3">
              <button onClick={() => setToDelete(null)} className="flex-1 border rounded-lg py-2 text-sm">Cancel</button>
              <button onClick={handleDelete} className="flex-1 bg-danger text-white rounded-lg py-2 text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}

      {serviceCustomer && (
        <AddServiceModal
          customer={serviceCustomer}
          onClose={() => setServiceCustomer(null)}
          onSaved={() => {
            setServiceCustomer(null);
            setToast("Service visit recorded successfully");
            loadCustomers();
          }}
        />
      )}
    </div>
  );
}