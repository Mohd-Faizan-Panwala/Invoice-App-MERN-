import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import InvoiceDetails from "./Pages/InvoiceDetails";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from "./Components/ProtectedRoute"
import InvoiceList from "./Pages/InvoiceList";
import CreateInvoice from "./Pages/CreateInvoice";
import EditInvoice from "./Pages/EditInvoice";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard"element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
        <Route path="/invoices/:id" element={ <ProtectedRoute> <InvoiceDetails /> </ProtectedRoute>}/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/invoices" element={<InvoiceList />} />
        <Route path="/create-invoice" element={<CreateInvoice />} />
        <Route path="/edit-invoice/:id" element={<EditInvoice />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;