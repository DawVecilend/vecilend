import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import StatusPage from "./pages/StatusPage";
import LoginPage from "./pages/LoginPage";
import CategoryPage from "./pages/CategoryPage";
import ObjectsPage from "./pages/ObjectsPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import CreateObjectPage from "./pages/CreateObjectPage";
import EditProfilePage from "./pages/EditProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import ObjectPage from "./pages/ObjectPage";
import HeaderDesktop from "./components/layouts/header/HeaderDesktop";
import HeaderMobile from "./components/layouts/header/HeaderMobile";
import Footer from "./components/layouts/footer/Footer";
import FloatingAddObjectButton from "./components/elementos/FloatingAddObjectButton";
import SettingsPage from "./pages/SettingsPage";
import SecuritySettingsPage from "./pages/SecuritySettingsPage";
import UserObjectsPage from "./pages/UserObjectsPage";
import ScrollToTop from "./components/ScrollToTop";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import EditObjectPage from "./pages/EditObjectPage";
import HowItWorksRentersPage from "./pages/HowItWorksRentersPage";
import HowItWorksLendersPage from "./pages/HowItWorksLendersPage";
import TransactionsPage from "./pages/TransactionsPage";
import PaymentMockPage from "./pages/PaymentMockPage";

function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <div className="hidden md:block">
        <HeaderDesktop />
      </div>

      <div className="md:hidden">
        <HeaderMobile />
      </div>

      <main className="md:pt-[80px]">
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/how-it-works/renters" element={<HowItWorksRentersPage />} />
          <Route path="/how-it-works/lenders" element={<HowItWorksLendersPage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/objects" element={<ObjectsPage />} />
          <Route path="/objects/:id" element={<ObjectPage />} />
          <Route path="/categorias/:slug" element={<CategoryPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route
            path="/profile/:username/objects"
            element={<UserObjectsPage />}
          />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Rutas Protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/objects/create" element={<CreateObjectPage />} />
            <Route path="/objects/:id/edit" element={<EditObjectPage />} />

            <Route
              path="/settings/profile/:username"
              element={<SettingsPage />}
            />
            <Route
              path="/settings/profile/:username/editing"
              element={<EditProfilePage />}
            />
            <Route
              path="/settings/profile/:username/security"
              element={<SecuritySettingsPage />}
            />
            <Route
              path="/settings/profile/:username/notifications"
              element={<SettingsPage />}
            />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route
              path="/transactions/:id/payment"
              element={<PaymentMockPage />}
            />
          </Route>
        </Routes>
      </main>

      <FloatingAddObjectButton />
      <Footer />
    </AuthProvider>
  );
}

export default App;
