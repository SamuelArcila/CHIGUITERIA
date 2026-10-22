import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './features/auth/AuthContext.jsx'
import LoginPage from './features/auth/LoginPage.jsx'
import RoleSelectPage from './features/auth/RoleSelectPage.jsx'
import SoloAdmin from './features/auth/SoloAdmin.jsx'
import StaffLayout from './features/auth/StaffLayout.jsx'
import { CartProvider } from './features/menu/CartContext.jsx'
import MenuPage from './features/menu/MenuPage.jsx'
import OrdersPage from './features/orders/OrdersPage.jsx'
import InventoryPage from './features/inventory/InventoryPage.jsx'
import TeamPage from './features/team/TeamPage.jsx'

// Cliente: "/" (sin cuenta). Personal: "/staff" (selector de rol, login y pestañas según el rol).
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<CartProvider><MenuPage /></CartProvider>} />
          <Route path="/staff" element={<RoleSelectPage />} />
          <Route path="/staff/ingresar/:rol" element={<LoginPage />} />
          <Route element={<StaffLayout />}>
            <Route path="/staff/pedidos" element={<OrdersPage />} />
            <Route path="/staff/inventario" element={<SoloAdmin><InventoryPage /></SoloAdmin>} />
            <Route path="/staff/equipo" element={<SoloAdmin><TeamPage /></SoloAdmin>} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
