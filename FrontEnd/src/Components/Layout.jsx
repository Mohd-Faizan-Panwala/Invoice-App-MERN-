import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Layout.css";

function Layout({ children }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="layout">
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-top">
          <h2>{collapsed ? "" : "InvoiceApp"}</h2>
          <button className="ml-40px" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? "☰" : "☰"}
          </button>
        </div>

        <div className="menu">
          <div onClick={() => navigate("/dashboard")}>
            📊 {!collapsed && "Dashboard"}
          </div>

          <div onClick={() => navigate("/invoices")}>
            🧾 {!collapsed && "Invoices"}
          </div>

          <div onClick={() => navigate("/create-invoice")}>
            ➕ {!collapsed && "Create Invoice"}
          </div>

          <div>
            📈 {!collapsed && "Reports"}
          </div>

          <div>
            ⚙ {!collapsed && "Settings"}
          </div>
        </div>

        {/* <button className="logout-btn" onClick={handleLogout}>
          {!collapsed && "Logout"}
        </button> */}
      </div>

      <div className="main-content">{children}</div>
    </div>
  );
}

export default Layout;