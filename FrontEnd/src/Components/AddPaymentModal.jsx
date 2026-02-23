import { useState } from "react";
import API from "../Services/api";
import "./Modal.css";

function AddPaymentModal({ invoiceId, close, refresh }) {
  const [amount, setAmount] = useState("");

  const handleSubmit = async () => {
    await API.post(`/invoices/${invoiceId}/payments`, {
      amount: Number(amount)
    });
    refresh();
    close();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Add Payment</h3>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div>
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={close}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default AddPaymentModal;