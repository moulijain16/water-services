import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CustomerForm from "../components/CustomerForm";
import { fetchCustomerById, updateCustomer } from "../services/api";

export default function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    fetchCustomerById(id).then((res) => setCustomer(res.data));
  }, [id]);

  const handleSubmit = async (form) => {
    await updateCustomer(id, form);
    navigate(`/customers/${id}`, { state: { message: "Customer updated successfully" } });
  };

  if (!customer) return <p className="p-4 text-sm text-ink-500">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Edit Customer</h1>
      <CustomerForm initialData={customer} onSubmit={handleSubmit} submitLabel="Save changes" />
    </div>
  );
}