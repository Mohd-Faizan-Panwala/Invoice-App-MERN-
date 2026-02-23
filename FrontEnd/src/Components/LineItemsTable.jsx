function LineItemsTable({ lines }) {
  return (
    <div style={{ marginBottom: "30px" }}>
      <h3>Line Items</h3>

      <table width="100%" cellPadding="12" style={{ borderCollapse: "collapse" }}>
        <thead style={{ background: "#f8f9fa" }}>
          <tr>
            <th align="left">Description</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <tr key={line._id} style={{ borderBottom: "1px solid #eee" }}>
              <td>{line.description}</td>
              <td align="center">{line.quantity}</td>
              <td align="center">₹{line.unitPrice}</td>
              <td align="center">₹{line.lineTotal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LineItemsTable;