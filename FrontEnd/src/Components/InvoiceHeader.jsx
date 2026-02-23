function InvoiceHeader({ invoice }) {
  return (
    <div style={{ marginBottom: "30px" }}>
      <h2>Invoice #{invoice.invoiceNumber}</h2>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <p><strong>Customer:</strong> {invoice.customerName}</p>
          <p><strong>Issue:</strong> {new Date(invoice.issueDate).toDateString()}</p>
          <p><strong>Due:</strong> {new Date(invoice.dueDate).toDateString()}</p>
        </div>

        <div>
          <span
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              background:
                invoice.status === "PAID" ? "#d4edda" : "#fff3cd",
              color:
                invoice.status === "PAID" ? "#155724" : "#856404",
              fontWeight: "bold"
            }}
          >
            {invoice.status}
          </span>
        </div>
      </div>
    </div>
  );
}

export default InvoiceHeader;