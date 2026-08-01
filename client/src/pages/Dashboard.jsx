import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchDashboardStats, fetchCustomers } from "../services/api";

export default function Dashboard() {
  const location = useLocation();
  const [stats, setStats] = useState(null);
  const [allCustomers, setAllCustomers] = useState([]);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(location.state?.message || "");
  const [activeFilter, setActiveFilter] = useState(null); // "total" | "overdue" | "dueToday" | "dueThisWeek" | null

  useEffect(() => {
    fetchDashboardStats()
      .then((res) => setStats(res.data))
      .catch(() => setError("Couldn't reach the server. Check your connection and try again."));
    fetchCustomers().then((res) => setAllCustomers(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const listsByFilter = {
    total: { title: "All customers", list: allCustomers, badge: null },
    overdue: { title: "Overdue customers", list: stats?.overdueList, badge: "Overdue" },
    dueToday: { title: "Due today", list: stats?.dueTodayList, badge: "Due today" },
    dueThisWeek: { title: "Due this week", list: stats?.dueThisWeekList, badge: "Due this week" },
  };

  const shownList = activeFilter ? listsByFilter[activeFilter] : null;
  const defaultList = [...(stats?.overdueList || []), ...(stats?.dueTodayList || [])];

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Dashboard</h1>

      {toast && <div className="mb-4 rounded-lg bg-ok/10 text-ok text-sm px-3 py-2">{toast}</div>}

      {error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              label="Total customers"
              value={stats?.totalCustomers}
              color="text-ink-900"
              active={activeFilter === "total"}
              onClick={() => setActiveFilter(activeFilter === "total" ? null : "total")}
            />
            <StatCard
              label="Overdue"
              value={stats?.overdueCount}
              color="text-danger"
              active={activeFilter === "overdue"}
              onClick={() => setActiveFilter(activeFilter === "overdue" ? null : "overdue")}
            />
            <StatCard
              label="Due today"
              value={stats?.dueTodayCount}
              color="text-warn"
              active={activeFilter === "dueToday"}
              onClick={() => setActiveFilter(activeFilter === "dueToday" ? null : "dueToday")}
            />
            <StatCard
              label="Due this week"
              value={stats?.dueThisWeekCount}
              color="text-teal-600"
              active={activeFilter === "dueThisWeek"}
              onClick={() => setActiveFilter(activeFilter === "dueThisWeek" ? null : "dueThisWeek")}
            />
          </div>

          <div className="mt-6 flex gap-3">
            <Link to="/customers" className="btn-primary inline-block">View all customers</Link>
            <Link to="/customers/add" className="bg-ink-900/5 hover:bg-ink-900/10 rounded-lg py-2.5 px-4 font-medium">
              Add customer
            </Link>
          </div>

          <div className="mt-8">
            <h2 className="font-semibold text-sm text-ink-700 mb-2">
              {shownList ? shownList.title : "Needs attention"}
            </h2>

            {(shownList ? shownList.list : defaultList)?.length === 0 ? (
              <p className="text-sm text-ink-500">Nobody here — nothing to show.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {(shownList ? shownList.list : defaultList)?.map((c) => (
                  <Link
                    key={c._id}
                    to={`/customers/${c._id}`}
                    className="flex items-center justify-between bg-white rounded-xl border border-ink-300/30 p-3 hover:shadow-sm"
                  >
                    <div>
                      <div className="font-medium text-sm">{c.name}</div>
                      <div className="text-xs text-ink-500">{c.phone}</div>
                    </div>
                    {(shownList?.badge || (!shownList && true)) && (
                      <span className="text-xs text-danger font-medium">
                        {shownList
                          ? shownList.badge
                          : new Date(c.nextServiceDate) < new Date()
                          ? "Overdue"
                          : "Due today"}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, color, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-left bg-white rounded-xl border p-4 transition-shadow ${
        active ? "border-teal-500 ring-1 ring-teal-500 shadow-sm" : "border-ink-300/30 hover:shadow-sm"
      }`}
    >
      <div className={`text-2xl font-semibold ${color}`}>{value ?? "–"}</div>
      <div className="text-xs text-ink-500 mt-0.5">{label}</div>
    </button>
  );
}