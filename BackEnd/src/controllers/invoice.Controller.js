const Invoice = require("../modules/Invoice");
const InvoiceLine = require("../modules/InvoiceLines");
const Payment = require("../modules/Payment");
const mongoose = require("mongoose");
const PDFDocument = require("pdfkit");

exports.createInvoice = async (req, res) => {
  try {
    const { invoiceNumber, customerName, issueDate, dueDate, lines } = req.body;

    if (!lines || lines.length === 0) {
      return res.status(400).json({ message: "Invoice must have line items" });
    }

    let total = 0;

    const calculatedLines = lines.map(item => {
      const lineTotal = item.quantity * item.unitPrice;
      total += lineTotal;

      return {
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal
      };
    });

    const invoice = await Invoice.create({
      invoiceNumber,
      customerName,
      issueDate,
      dueDate,
      total,
      amountPaid: 0,
      balanceDue: total,
      status: "DRAFT"
    });

    const linesToInsert = calculatedLines.map(line => ({
      ...line,
      invoiceId: invoice._id
    }));

    await InvoiceLine.insertMany(linesToInsert);

    res.status(201).json({
      message: "Invoice created successfully",
      invoiceId: invoice._id
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getInvoiceDetails = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const lines = await InvoiceLine.find({ invoiceId: invoice._id });
    const payments = await Payment.find({ invoiceId: invoice._id });

    res.json({
      invoice,
      lines,
      payments,
      total: invoice.total,
      amountPaid: invoice.amountPaid,
      balanceDue: invoice.balanceDue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addPayment = async (req, res) => {
  try {
    const { amount } = req.body;

    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    if (amount > invoice.balanceDue) {
      return res.status(400).json({ message: "Overpayment not allowed" });
    }

    const payment = await Payment.create({
      invoiceId: invoice._id,
      amount
    });

    invoice.amountPaid += amount;
    invoice.balanceDue = invoice.total - invoice.amountPaid;

    if (invoice.balanceDue === 0) {
      invoice.status = "PAID";
    }

    await invoice.save();

    res.status(201).json({ message: "Payment added", payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.archiveInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.body.id);
    invoice.isArchived = true;
    await invoice.save();
    res.json({ message: "Invoice archived" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.restoreInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.body.id);
    invoice.isArchived = false;
    await invoice.save();
    res.json({ message: "Invoice restored" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.downloadInvoicePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    const lines = await InvoiceLine.find({ invoiceId: invoice._id });
    const payments = await Payment.find({ invoiceId: invoice._id });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`
    );

    doc.pipe(res);

    /* ---------------- HEADER ---------------- */

    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .text("INVOICE", { align: "center" });

    doc.moveDown(1.5);

    doc
      .fontSize(12)
      .font("Helvetica")
      .text(`Invoice Number: ${invoice.invoiceNumber}`);
    doc.text(`Issue Date: ${invoice.issueDate.toDateString()}`);
    doc.text(`Due Date: ${invoice.dueDate.toDateString()}`);

    doc.moveDown();

    doc
      .font("Helvetica-Bold")
      .text("Bill To:");
    doc
      .font("Helvetica")
      .text(invoice.customerName);

    doc.moveDown(2);

    /* ---------------- TABLE HEADER ---------------- */

    const tableTop = doc.y;
    const itemX = 50;
    const qtyX = 300;
    const priceX = 350;
    const totalX = 450;

    doc.font("Helvetica-Bold");
    doc.text("Description", itemX, tableTop);
    doc.text("Qty", qtyX, tableTop);
    doc.text("Unit Price", priceX, tableTop);
    doc.text("Total", totalX, tableTop);

    doc.moveDown();

    /* ---------------- TABLE ROWS ---------------- */

    doc.font("Helvetica");

    let totalAmount = 0;

    lines.forEach((item, i) => {
      const y = doc.y;

      doc.text(item.description, itemX, y);
      doc.text(item.quantity.toString(), qtyX, y);
      doc.text(`₹${item.unitPrice}`, priceX, y);
      doc.text(`₹${item.lineTotal}`, totalX, y);

      totalAmount += item.lineTotal;
      doc.moveDown();
    });

    doc.moveDown(2);

    /* ---------------- TOTALS ---------------- */

    doc.font("Helvetica-Bold");
    doc.text(`Total: ₹${invoice.total}`, 350);
    doc.text(`Amount Paid: ₹${invoice.amountPaid}`, 350);
    doc.text(`Balance Due: ₹${invoice.balanceDue}`, 350);

    doc.moveDown(2);

    /* ---------------- PAYMENTS ---------------- */

    if (payments.length > 0) {
      doc.font("Helvetica-Bold").text("Payments:");
      doc.moveDown(0.5);
      doc.font("Helvetica");

      payments.forEach((p) => {
        doc.text(
          `₹${p.amount} on ${p.paymentDate.toDateString()}`
        );
      });
    }

    doc.moveDown(3);

    /* ---------------- FOOTER ---------------- */

    doc
      .fontSize(10)
      .fillColor("gray")
      .text("Thank you for your business!", { align: "center" });

    doc.end();

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const invoices = await Invoice.find({ isArchived: false });

    const totalInvoices = invoices.length;
    const totalRevenue = invoices.reduce((acc, inv) => acc + inv.total, 0);
    const totalPaid = invoices.reduce((acc, inv) => acc + inv.amountPaid, 0);
    const totalOutstanding = invoices.reduce((acc, inv) => acc + inv.balanceDue, 0);

    const paidRate =
      totalRevenue === 0
        ? 0
        : ((totalPaid / totalRevenue) * 100).toFixed(1);

    // Monthly revenue (basic grouping)
    const monthlyData = {};

    invoices.forEach((inv) => {
      const month = new Date(inv.issueDate).toLocaleString("default", {
        month: "short"
      });

      monthlyData[month] = (monthlyData[month] || 0) + inv.total;
    });

    const monthlyRevenue = Object.keys(monthlyData).map((month) => ({
      month,
      revenue: monthlyData[month]
    }));

    const recentInvoices = invoices
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5);

    res.json({
      totalInvoices,
      totalRevenue,
      totalPaid,
      totalOutstanding,
      paidRate,
      monthlyRevenue,
      recentInvoices
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};  