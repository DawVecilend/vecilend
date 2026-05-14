import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import StatusPage from "./pages/StatusPage";
import LoginPage from "./pages/LoginPage";
import ObjectsPage from "./pages/ObjectsPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import CreateObjectPage from "./pages/CreateObjectPage";
import EditProfilePage from "./pages/EditProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { BackofficeAuthProvider } from "./contexts/BackofficeAuthContext";
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
import ForbiddenPage from "./pages/ForbiddenPage";
import ChatsLayout from "./components/chats/ChatsLayout";
import ChatPage from "./pages/ChatPage";
import NotificationsPage from "./pages/NotificationsPage";
import { UnreadCountsProvider } from "./contexts/UnreadCountsContext";
import { ToastProvider } from "./contexts/ToastContext";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminEmpleatsPage from "./pages/admin/AdminEmpleatsPage";
import AdminCreateEmpleatPage from "./pages/admin/AdminCreateEmpleatPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import AdminLogsPage from "./pages/admin/AdminLogsPage";
import AdminCreateCategoryPage from "./pages/admin/AdminCreateCategoryPage";

function App() {
  return (
    <ToastProvider>
      <Routes>
        {/* ─── Backoffice (auth y contexto independientes) ─── */}
        <Route
          path="/backoffice/*"
          element={
            <BackofficeAuthProvider>
              <Routes>
                <Route path="/" element={<AdminLoginPage />} />

                {/* Admin y suport */}
                <Route element={<AdminProtectedRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route path="/dashboard" element={<AdminDashboardPage />} />
                    <Route path="/users" element={<AdminUsersPage />} />
                    <Route path="/reports" element={<AdminReportsPage />} />
                  </Route>
                </Route>

                {/* Solo admin */}
                <Route element={<AdminProtectedRoute requireRol="admin" />}>
                  <Route element={<AdminLayout />}>
                    <Route path="/empleats" element={<AdminEmpleatsPage />} />
                    <Route path="/empleats/create" element={<AdminCreateEmpleatPage />} />
                    <Route path="/categories" element={<AdminCategoriesPage />} />
                    <Route path="/categories/create" element={<AdminCreateCategoryPage />} />
                    <Route path="/logs" element={<AdminLogsPage />} />
                  </Route>
                </Route>

                <Route path="*" element={<NotFoundPage backofficeMode />} />
              </Routes>
            </BackofficeAuthProvider>
          }
        />

        {/* ─── Resto de la app ─── */}
        <Route
          path="/*"
          element={
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
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/how-it-works/renters" element={<HowItWorksRentersPage />} />
                    <Route path="/how-it-works/lenders" element={<HowItWorksLendersPage />} />
                    <Route path="/status" element={<StatusPage />} />
                    <Route path="/objects" element={<ObjectsPage />} />
                    <Route path="/objects/:id" element={<ObjectPage />} />
                    <Route path="/profile/:username" element={<ProfilePage />} />
                    <Route path="/profile/:username/objects" element={<UserObjectsPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/forbidden" element={<ForbiddenPage />} />

                    <Route element={<ProtectedRoute />}>
                      <Route path="/objects/create" element={<CreateObjectPage />} />
                      <Route path="/objects/:id/edit" element={<EditObjectPage />} />
                      <Route path="/settings/profile/:username" element={<SettingsPage />} />
                      <Route path="/settings/profile/:username/editing" element={<EditProfilePage />} />
                      <Route path="/settings/profile/:username/security" element={<SecuritySettingsPage />} />
                      <Route path="/settings/profile/:username/notifications" element={<SettingsPage />} />
                      <Route path="/orders" element={<MyOrdersPage />} />
                      <Route path="/transactions" element={<Navigate to="/orders" replace />} />
                      <Route path="/transactions/:id/payment" element={<PaymentMockPage />} />
                      <Route path="/favorites" element={<FavoritesPage />} />
                      <Route path="/chats" element={<ChatsLayout />}>
                        <Route index element={null} />
                        <Route path=":id" element={<ChatPage />} />
                      </Route>
                      <Route path="/notifications" element={<NotificationsPage />} />
                    </Route>

                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>

                <FloatingAddObjectButton />
                <Footer />
              </UnreadCountsProvider>
            </AuthProvider>
          }
        />
      </Routes>
    </ToastProvider>
  );
}

export default App;
