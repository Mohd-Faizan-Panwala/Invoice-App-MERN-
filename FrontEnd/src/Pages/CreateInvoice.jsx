import { useState } from "react";
import API from "../Services/api";
import Layout from "../Components/Layout";
import "./CreateInvoice.css";

function CreateInvoice() {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [currency, setCurrency] = useState("INR");

  const [items, setItems] = useState([
    { description: "", quantity: 1, unitPrice: 0 }
  ]);

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleSubmit = async () => {
    await API.post("/invoices", {
      invoiceNumber,
      customerName,
      issueDate,
      dueDate,
      lines: items
    });

    alert("Invoice Created");
  };

  const total = items.reduce(
    (acc, item) => acc + item.quantity * item.unitPrice,
    0
  );

  return (
    <Layout>
      <div className="create-wrapper">
        <h2>Create Invoice</h2>

        <div className="form-grid">
          <input
            placeholder="Invoice Number"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />

          <input
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <input
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option>INR</option>
            <option>USD</option>
            <option>EUR</option>
          </select>
        </div>

        <table className="items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(index, "description", e.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", Number(e.target.value))
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(index, "unitPrice", Number(e.target.value))
                    }
                  />
                </td>

                <td>
                  {item.quantity * item.unitPrice}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={addItem}>+ Add Item</button>

        <h3>Total: {total} {currency}</h3>

        <button className="submit-btn" onClick={handleSubmit}>
          Save Invoice
        </button>
      </div>
    </Layout>
  );
}

export default CreateInvoice;