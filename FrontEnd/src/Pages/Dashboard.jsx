import { useEffect, useState } from "react";
import API from "../Services/api";
import Layout from "../Components/Layout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import "./Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const res = await API.get("/invoices/stats/summary");
    setStats(res.data);
  };

  if (!stats) return <Layout>Loading...</Layout>;

  const pieData = [
    { name: "Paid", value: stats.totalPaid },
    { name: "Outstanding", value: stats.totalOutstanding }
  ];

  const COLORS = ["#10b981", "#ef4444"];

  return (
    <Layout>
      <div className="dashboard-wrapper">
        <h2>Dashboard Overview</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Revenue</h4>
            <p>₹{stats.totalRevenue}</p>
          </div>

          <div className="stat-card">
            <h4>Total Paid</h4>
            <p>₹{stats.totalPaid}</p>
          </div>

          <div className="stat-card">
            <h4>Outstanding</h4>
            <p>₹{stats.totalOutstanding}</p>
          </div>

          <div className="stat-card">
            <h4>Paid Rate</h4>
            <p>{stats.paidRate}%</p>
          </div>
        </div>
        <div className="charts-grid">

          <div className="chart-card">
            <h3>Monthly Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.monthlyRevenue}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3f5cff"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Payment Distribution</h3>
            <ResponsiveContainer width="100%" height={100}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={40}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>
        <div className="recent-card">
          <h3>Recent Invoices</h3>
          {stats.recentInvoices.map((inv) => (
            <div key={inv._id} className="recent-row">
              <span>{inv.invoiceNumber}</span>
              <span>₹{inv.total}</span>
              <span className={inv.status === "PAID" ? "paid" : "draft"}>
                {inv.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;