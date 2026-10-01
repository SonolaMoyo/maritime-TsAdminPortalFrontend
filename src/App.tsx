import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { SegmentProvider } from "./context/SegmentContext";
import { MainLayout } from "./components/layout/MainLayout";
import { Login } from "./pages/Login";

// Primary Portal Pages (V2 Architecture)
import { DashboardV2 } from "./pages/v2/DashboardV2";
import { Requests } from "./pages/v2/Requests";
import { RequestDetail } from "./pages/v2/RequestDetail";
import { OrdersV2 } from "./pages/v2/OrdersV2";
import { OrderDetail } from "./pages/v2/OrderDetail";
import { InventoryV2 } from "./pages/v2/InventoryV2";
import { Catalog } from "./pages/v2/Catalog";
import { CatalogProductDetail } from "./pages/v2/CatalogProductDetail";
import { RolesPermissions } from "./pages/v2/RolesPermissions";
import { SystemSettings } from "./pages/v2/SystemSettings";

function App() {
  return (
    <SegmentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<MainLayout><Outlet /></MainLayout>}>
            {/* Primary Clean Routes */}
            <Route path="/" element={<DashboardV2 />} />
            <Route path="/dashboard" element={<DashboardV2 />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/requests/:id" element={<RequestDetail />} />
            <Route path="/orders" element={<OrdersV2 />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/inventory" element={<InventoryV2 />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/catalog/products/new" element={<CatalogProductDetail isNew={true} />} />
            <Route path="/catalog/products/:id" element={<CatalogProductDetail />} />
            <Route path="/roles-permissions" element={<RolesPermissions />} />
            <Route path="/system-settings" element={<SystemSettings />} />

            {/* Backwards-compatible /v2/ aliases */}
            <Route path="/v2/dashboard" element={<DashboardV2 />} />
            <Route path="/v2/requests" element={<Requests />} />
            <Route path="/v2/requests/:id" element={<RequestDetail />} />
            <Route path="/v2/orders" element={<OrdersV2 />} />
            <Route path="/v2/orders/:id" element={<OrderDetail />} />
            <Route path="/v2/inventory" element={<InventoryV2 />} />
            <Route path="/v2/catalog" element={<Catalog />} />
            <Route path="/v2/catalog/products/new" element={<CatalogProductDetail isNew={true} />} />
            <Route path="/v2/catalog/products/:id" element={<CatalogProductDetail />} />
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
