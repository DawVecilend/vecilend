import { Routes, Route, Navigate } from "react-router-dom";
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
import MyOrdersPage from "./pages/MyOrdersPage";
import FavoritesPage from "./pages/FavoritesPage";
import PaymentMockPage from "./pages/PaymentMockPage";
import NotFoundPage from "./pages/NotFoundPage";
import ChatsListPage from "./pages/ChatsListPage";
import ChatPage from "./pages/ChatPage";
import NotificationsPage from "./pages/NotificationsPage";
import { UnreadCountsProvider } from "./contexts/UnreadCountsContext";

function App() {
  return (
    <AuthProvider>
      <UnreadCountsProvider>
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

            <Route
              path="/how-it-works/renters"
              element={<HowItWorksRentersPage />}
            />

            <Route
              path="/how-it-works/lenders"
              element={<HowItWorksLendersPage />}
            />

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

              <Route path="/orders" element={<MyOrdersPage />} />
              <Route
                path="/transactions"
                element={<Navigate to="/orders" replace />}
              />

              <Route
                path="/transactions/:id/payment"
                element={<PaymentMockPage />}
              />

              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/chats" element={<ChatsListPage />} />
              <Route path="/chats/:id" element={<ChatPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <FloatingAddObjectButton />
        <Footer />
      </UnreadCountsProvider>
    </AuthProvider>
  );
}

export default App;
