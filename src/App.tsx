import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { SegmentProvider } from "./context/SegmentContext";
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

// v2 Pages
import { DashboardV2 } from "./pages/v2/DashboardV2";
import { Requests } from "./pages/v2/Requests";
import { RequestDetail } from "./pages/v2/RequestDetail";
import { OrdersV2 } from "./pages/v2/OrdersV2";
import { InventoryV2 } from "./pages/v2/InventoryV2";
import { Catalog } from "./pages/v2/Catalog";
import { RolesPermissions } from "./pages/v2/RolesPermissions";
import { SystemSettings } from "./pages/v2/SystemSettings";

function App() {
  return (
    <SegmentProvider>
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

          {/* v2 Routes */}
          <Route path="/v2/dashboard" element={<DashboardV2 />} />
          <Route path="/v2/requests" element={<Requests />} />
          <Route path="/v2/requests/:id" element={<RequestDetail />} />
          <Route path="/v2/orders" element={<OrdersV2 />} />
          <Route path="/v2/inventory" element={<InventoryV2 />} />
          <Route path="/v2/catalog" element={<Catalog />} />
          <Route path="/v2/roles-permissions" element={<RolesPermissions />} />
          <Route path="/v2/system-settings" element={<SystemSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </SegmentProvider>
  );
}

export default App;
