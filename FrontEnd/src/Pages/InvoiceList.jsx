import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../Services/api";
import Layout from "../Components/Layout";

function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    const res = await API.get("/invoices");
    setInvoices(res.data);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Layout>
      <div style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between",color:"black"}}>
        <h2>Invoices</h2>
        <button style={{width:"80px",height:"40px",paddingLeft:"-20px",justifyContent:"center"}} onClick={handleLogout}>Logout</button>
      </div>

      <div style={{ background: "white", padding: "20px", borderRadius: "10px",color:"black" }}>
        {invoices.length === 0 ? (
          <p>No invoices found</p>
        ) : (
          invoices.map((inv) => (
            <div
              key={inv._id}
              style={{
                padding: "15px",
                borderBottom: "1px solid #eee",
                cursor: "pointer"
              }}
              onClick={() => navigate(`/invoices/${inv._id}`)}
            >
              <strong>{inv.invoiceNumber}</strong> — {inv.customerName} — ₹{inv.total}
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}

export default Dashboard;