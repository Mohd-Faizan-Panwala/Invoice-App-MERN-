import { useState } from "react";
import API from "../Services/api";

function PaymentsSection({ payments, invoiceId, refresh }) {
  const [amount, setAmount] = useState("");

  const handlePayment = async () => {
    if (!amount) return;

    await API.post(`/invoices/${invoiceId}/payments`, {
      amount: Number(amount)
    });

    setAmount("");
    refresh();
  };

  return (
    <div>
      <h3>Payments</h3>

      {payments.map((p) => (
        <div key={p._id}>
          ₹{p.amount} — {new Date(p.paymentDate).toDateString()}
        </div>
      ))}

      <div style={{ marginTop: "20px" }}>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handlePayment} style={{ marginLeft: "10px" }}>
          Add Payment
        </button>
      </div>
    </div>
  );
}

export default PaymentsSection;