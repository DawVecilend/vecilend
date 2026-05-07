import { Routes, Route } from "react-router-dom";

// COMPONENTES
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { UnreadCountsProvider } from "./contexts/UnreadCountsContext";
import ScrollToTop from "./components/ScrollToTop";
import HeaderDesktop from "./components/layouts/header/HeaderDesktop";
import HeaderMobile from "./components/layouts/header/HeaderMobile";
import Footer from "./components/layouts/footer/Footer";
import FloatingAddObjectButton from "./components/elementos/FloatingAddObjectButton";

// MAIN PAGES
import HomePage from "./pages/main/HomePage";
import StatusPage from "./pages/main/StatusPage";
import NotFoundPage from "./pages/main/NotFoundPage";
import HowItWorksRentersPage from "./pages/main/HowItWorksRentersPage";
import HowItWorksLendersPage from "./pages/main/HowItWorksLendersPage";
import ChatsListPage from "./pages/chats/ChatsListPage";
import ChatPage from "./pages/chats/ChatPage";

// AUTH PAGES
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// USER PAGES
import ProfilePage from "./pages/user/ProfilePage";
import EditProfilePage from "./pages/user/EditProfilePage";
import SecuritySettingsPage from "./pages/user/SecuritySettingsPage";
import SettingsPage from "./pages/user/SettingsPage";
import TransactionsPage from "./pages/user/TransactionsPage";
import NotificationsPage from "./pages/user/NotificationsPage";
import ForgotPasswordPage from "./pages/user/ForgotPasswordPage";
import ResetPasswordPage from "./pages/user/ResetPasswordPage";

// OBJECTS PAGES
import ObjectPage from "./pages/objects/ObjectPage";
import ObjectsPage from "./pages/objects/ObjectsPage";
import CreateObjectPage from "./pages/objects/CreateObjectPage";
import UserObjectsPage from "./pages/objects/UserObjectsPage";
import EditObjectPage from "./pages/objects/EditObjectPage";

// CATEGORIES PAGES
import CategoryPage from "./pages/categories/CategoryPage";

// FUNCTIONALITS PAGES
import PaymentMockPage from "./pages/mockups/PaymentMockPage";

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
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route
                path="/transactions/:id/payment"
                element={<PaymentMockPage />}
              />
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
