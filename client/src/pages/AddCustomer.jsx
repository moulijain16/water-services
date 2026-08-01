import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerForm from "../components/CustomerForm";
import { createCustomer } from "../services/api";

export default function AddCustomer() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (form) => {
    try {
      await createCustomer(form);
      navigate("/", { state: { message: "Customer added successfully" } });
    } catch (err) {
      setError(err?.response?.data?.message || "Could not add customer.");
      throw err;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Add Customer</h1>
      <CustomerForm onSubmit={handleSubmit} submitLabel="Add customer" />
    </div>
  );
}