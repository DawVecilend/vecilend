import { Routes, Route, Navigate } from "react-router-dom";

// COMPONENTES
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { BackofficeAuthProvider } from "./contexts/BackofficeAuthContext";
import { UnreadCountsProvider } from "./contexts/UnreadCountsContext";
import { ToastProvider } from "./contexts/ToastContext";
import ScrollToTop from "./components/ScrollToTop";

import HeaderDesktop from "./components/layouts/header/HeaderDesktop";
import HeaderMobile from "./components/layouts/header/HeaderMobile";
import Footer from "./components/layouts/footer/Footer";

// MAIN PAGES
import HomePage from "./pages/main/HomePage";
import StatusPage from "./pages/main/StatusPage";
import NotFoundPage from "./pages/main/NotFoundPage";
import ForbiddenPage from "./pages/main/ForbiddenPage";
import HowItWorksRequestersPage from "./pages/main/HowItWorksRequestersPage";
import HowItWorksOwnersPage from "./pages/main/HowItWorksOwnersPage";
import TermsPage from "./pages/main/TermsPage";
import PrivacyPolicyPage from "./pages/main/PrivacyPolicyPage";
import FeatureComingSoonPage from "./pages/main/FeatureComingSoonPage";
import AboutUsPage from "./pages/main/AboutUsPage";
import FAQPage from "./pages/main/FAQPage";

// AUTH PAGES
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import GoogleCallbackPage from "./pages/auth/GoogleCallbackPage";

// USER PAGES
import ProfilePage from "./pages/user/ProfilePage";
import EditProfilePage from "./pages/user/EditProfilePage";
import SecuritySettingsPage from "./pages/user/SecuritySettingsPage";
import SettingsPage from "./pages/user/SettingsPage";
import NotificationsPage from "./pages/user/NotificationsPage";
import ForgotPasswordPage from "./pages/user/ForgotPasswordPage";
import ResetPasswordPage from "./pages/user/ResetPasswordPage";
import MyOrdersPage from "./pages/user/MyOrdersPage";
import FavoritesPage from "./pages/user/FavoritesPage";

// OBJECTS PAGES
import ObjectPage from "./pages/objects/ObjectPage";
import ObjectsPage from "./pages/objects/ObjectsPage";
import CreateObjectPage from "./pages/objects/CreateObjectPage";
import UserObjectsPage from "./pages/objects/UserObjectsPage";
import EditObjectPage from "./pages/objects/EditObjectPage";

// CATEGORIES PAGES
import CategoryPage from "./pages/categories/CategoryPage";

// CHATS PAGES
import ChatsLayout from "./components/chats/ChatsLayout";
import ChatPage from "./pages/chats/ChatPage";

// FUNCTIONALITS PAGES
import PaymentMockPage from "./pages/mockups/PaymentMockPage";

// ADMIN PAGES
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminEmpleatsPage from "./pages/admin/AdminEmpleatsPage";
import AdminCreateEmpleatPage from "./pages/admin/AdminCreateEmpleatPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import AdminLogsPage from "./pages/admin/AdminLogsPage";
import AdminCreateCategoryPage from "./pages/admin/AdminCreateCategoryPage";

// ADMIN COMPONENTS
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import CookieBanner from "./components/elementos/CookieBanner";
import AdminLayout from "./components/admin/AdminLayout";

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route
          path="/backoffice/*"
          element={
            <BackofficeAuthProvider>
              <Routes>
                <Route path="/" element={<AdminLoginPage />} />

                <Route element={<AdminProtectedRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route path="/dashboard" element={<AdminDashboardPage />} />
                    <Route path="/users" element={<AdminUsersPage />} />
                    <Route path="/reports" element={<AdminReportsPage />} />
                  </Route>
                </Route>

                <Route element={<AdminProtectedRoute requireRol="admin" />}>
                  <Route element={<AdminLayout />}>
                    <Route path="/empleats" element={<AdminEmpleatsPage />} />
                    <Route
                      path="/empleats/create"
                      element={<AdminCreateEmpleatPage />}
                    />
                    <Route
                      path="/categories"
                      element={<AdminCategoriesPage />}
                    />
                    <Route
                      path="/categories/create"
                      element={<AdminCreateCategoryPage />}
                    />
                    <Route path="/logs" element={<AdminLogsPage />} />
                  </Route>
                </Route>

                <Route path="*" element={<NotFoundPage backofficeMode />} />
              </Routes>
            </BackofficeAuthProvider>
          }
        />

        <Route
          path="/*"
          element={
            <AuthProvider>
              <UnreadCountsProvider>
                <ScrollToTop />
                <CookieBanner />

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
                    <Route
                      path="/auth/google/callback"
                      element={<GoogleCallbackPage />}
                    />

                    <Route
                      path="/how-it-works/requesters"
                      element={<HowItWorksRequestersPage />}
                    />
                    <Route
                      path="/how-it-works/owners"
                      element={<HowItWorksOwnersPage />}
                    />
                    <Route
                      path="/how-it-works/renters"
                      element={<Navigate to="/how-it-works/requesters" replace />}
                    />
                    <Route
                      path="/how-it-works/lenders"
                      element={<Navigate to="/how-it-works/owners" replace />}
                    />

                    <Route path="/status" element={<StatusPage />} />
                    <Route
                      path="/terminos-y-condiciones"
                      element={<TermsPage />}
                    />
                    <Route
                      path="/politica-de-privacidad"
                      element={<PrivacyPolicyPage />}
                    />
                    <Route
                      path="/feature-coming-soon"
                      element={<FeatureComingSoonPage />}
                    />
                    <Route path="/about-us" element={<AboutUsPage />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/objects" element={<ObjectsPage />} />
                    <Route
                      path="/objects/:id/:slug?"
                      element={<ObjectPage />}
                    />
                    <Route
                      path="/categories/:slug"
                      element={<CategoryPage />}
                    />

                    <Route
                      path="/profile/:username"
                      element={<ProfilePage />}
                    />
                    <Route
                      path="/profile/:username/objects"
                      element={<UserObjectsPage />}
                    />

                    <Route
                      path="/forgot-password"
                      element={<ForgotPasswordPage />}
                    />
                    <Route
                      path="/reset-password"
                      element={<ResetPasswordPage />}
                    />
                    <Route path="/forbidden" element={<ForbiddenPage />} />

                    <Route element={<ProtectedRoute />}>
                      <Route
                        path="/objects/create"
                        element={<CreateObjectPage />}
                      />
                      <Route
                        path="/objects/:id/edit"
                        element={<EditObjectPage />}
                      />

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

                      <Route path="/chats" element={<ChatsLayout />}>
                        <Route index element={null} />
                        <Route path=":id" element={<ChatPage />} />
                      </Route>

                      <Route
                        path="/notifications"
                        element={<NotificationsPage />}
                      />
                    </Route>

                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>

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
