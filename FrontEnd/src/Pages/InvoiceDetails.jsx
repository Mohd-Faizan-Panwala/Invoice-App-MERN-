import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../Services/api";
import AddPaymentModal from "../Components/AddPaymentModal";
import "./InvoiceDetails.css";
import { useNavigate } from "react-router-dom";

function InvoiceDetails() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchInvoice();
    }, []);

    const fetchInvoice = async () => {
        const res = await API.get(`/invoices/${id}`);
        setData(res.data);
    };

    if (!data) return <p>Loading...</p>;

    const { invoice, lines, payments } = data;

    return (
        <div className="invoice-wrapper">
            <div className="invoice-card">
                <div className="invoice-header">
                    <div>
                        <h2>Invoice #{invoice.invoiceNumber}</h2>
                        <p>{invoice.customerName}</p>
                        <p>
                            {new Date(invoice.issueDate).toDateString()} |{" "}
                            {new Date(invoice.dueDate).toDateString()}
                        </p>
                    </div>

                    <div className="header-actions ">
                        <div className={`status-badge ${invoice.status.toLowerCase()}`}>{invoice.status}</div>
                        <button className="edit-btn"onClick={() => navigate(`/edit-invoice/${id}`)}>🖋️Edit</button>
                        <button className="pdf-btn"onClick={() => window.open(`http://localhost:5000/api/invoices/${id}/pdf`,"_blank")}>📄Download PDF</button>
                    </div>
                </div>
                <table className="invoice-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Qty</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lines.map((line) => (
                            <tr key={line._id}>
                                <td>{line.description}</td>
                                <td>{line.quantity}</td>
                                <td>₹{line.unitPrice}</td>
                                <td>₹{line.lineTotal}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="totals-section">
                    <div className="totals-box">
                        <div className="row">
                            <span>Total</span>
                            <span>₹{data.total}</span>
                        </div>
                        <div className="row">
                            <span>Paid</span>
                            <span>₹{data.amountPaid}</span>
                        </div>
                        <div className="row balance">
                            <span>Balance</span>
                            <span>₹{data.balanceDue}</span>
                        </div>
                    </div>
                </div>
                <div className="payments-section">
                    <h3>Payments</h3>

                    {payments.length === 0 ? (
                        <p>No payments yet</p>
                    ) : (
                        payments.map((p) => (
                            <div key={p._id} className="payment-item">
                                <div>₹{p.amount}</div>
                                <div>{new Date(p.paymentDate).toDateString()}</div>
                            </div>
                        ))
                    )}

                    <button onClick={() => setShowModal(true)}>
                        Add Payment
                    </button>
                </div>

                {showModal && (
                    <AddPaymentModal
                        invoiceId={id}
                        close={() => setShowModal(false)}
                        refresh={fetchInvoice}
                    />
                )}

            </div>
        </div>
    );
}

export default InvoiceDetails;