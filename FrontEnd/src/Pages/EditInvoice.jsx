import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../Services/api";
import Layout from "../Components/Layout";
import "./CreateInvoice.css";

function EditInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchInvoice();
  }, []);

  const fetchInvoice = async () => {
    const res = await API.get(`/invoices/${id}`);
    const { invoice, lines } = res.data;

    setInvoiceNumber(invoice.invoiceNumber);
    setCustomerName(invoice.customerName);
    setIssueDate(invoice.issueDate.split("T")[0]);
    setDueDate(invoice.dueDate.split("T")[0]);
    setItems(lines);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const handleSubmit = async () => {
    await API.put(`/invoices/${id}`, {
      invoiceNumber,
      customerName,
      issueDate,
      dueDate,
      lines: items
    });

    alert("Invoice Updated");
    navigate(`/invoices/${id}`);
  };

  const total = items.reduce(
    (acc, item) => acc + item.quantity * item.unitPrice,
    0
  );

  return (
    <Layout>
      <div className="create-wrapper">
        <h2>Edit Invoice</h2>

        <div className="form-grid">
          <input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
          <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>

        <table className="items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
              <th></th>
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

                <td>{item.quantity * item.unitPrice}</td>

                <td>
                  <button onClick={() => removeItem(index)}>❌</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={addItem}>+ Add Item</button>

        <h3>Total: {total}</h3>

        <button className="submit-btn" onClick={handleSubmit}>
          Update Invoice
        </button>
      </div>
    </Layout>
  );
}

export default EditInvoice;