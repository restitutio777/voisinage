import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { PWAUpdateNotification } from './components/PWAUpdateNotification';
import { HomePage } from './pages/HomePage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { CreateListingPage } from './pages/CreateListingPage';
import { ExchangePage } from './pages/ExchangePage';
import { CreateExchangeWishPage } from './pages/CreateExchangeWishPage';
import { MessagesPage } from './pages/MessagesPage';
import { ConversationPage } from './pages/ConversationPage';
import { ProfilePage } from './pages/ProfilePage';
import { PublicProfilePage } from './pages/PublicProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { MentionsLegalesPage } from './pages/MentionsLegalesPage';
import { PolitiqueConfidentialitePage } from './pages/PolitiqueConfidentialitePage';
import { CGUPage } from './pages/CGUPage';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <PWAUpdateNotification />
            <PWAInstallPrompt />
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/annonce/:id" element={<ListingDetailPage />} />
                <Route path="/creer" element={<CreateListingPage />} />
                <Route path="/echanger" element={<ExchangePage />} />
                <Route path="/echanger/nouveau" element={<CreateExchangeWishPage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/messages/:id" element={<ConversationPage />} />
                <Route path="/profil" element={<ProfilePage />} />
                <Route path="/voisin/:id" element={<PublicProfilePage />} />
                <Route path="/decouvrir-app" element={<OnboardingPage />} />
                <Route path="/connexion" element={<LoginPage />} />
                <Route path="/inscription" element={<RegisterPage />} />
                <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
                <Route path="/politique-confidentialite" element={<PolitiqueConfidentialitePage />} />
                <Route path="/conditions-utilisation" element={<CGUPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
