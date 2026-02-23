const express = require("express");
const {getInvoiceDetails,addPayment,archiveInvoice,restoreInvoice,createInvoice,downloadInvoicePDF,getDashboardStats} = require("../controllers/invoice.Controller");
// const { createInvoice } = require("../controllers/invoice.Controller");
const authMiddleware = require("../middleware/auth.Middleware");
const Invoice = require("../modules/Invoice");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const invoices = await Invoice.find({ isArchived: false }).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.use(authMiddleware);
router.get("/:id", getInvoiceDetails);
router.post("/:id/payments", addPayment);
router.post("/archive", archiveInvoice);
router.post("/restore", restoreInvoice);
router.post("/", createInvoice);
router.get("/:id/pdf", downloadInvoicePDF);
router.get("/stats/summary", authMiddleware, getDashboardStats);

module.exports = router;
