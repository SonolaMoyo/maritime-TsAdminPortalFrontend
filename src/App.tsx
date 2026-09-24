import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Orders } from "./pages/Orders";
import { Payments } from "./pages/Payments";
import { Sales } from "./pages/Sales";
import { Inventory } from "./pages/Inventory";
import { Distribution } from "./pages/Distribution";
import { Deliveries } from "./pages/Deliveries";
import { Schedule } from "./pages/Schedule";
import { Clients } from "./pages/Clients";
import { Referrals } from "./pages/Referrals";
import { Products } from "./pages/Products";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<MainLayout><Outlet /></MainLayout>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/distribution" element={<Distribution />} />
          <Route path="/deliveries" element={<Deliveries />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/referrals" element={<Referrals />} />
          <Route path="/products" element={<Products />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
