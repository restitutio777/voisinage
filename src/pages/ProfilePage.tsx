import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, MapPin, Calendar, LogOut, Edit2, Trash2, Leaf, Bell, BellOff, CheckCircle, FileText, Shield, Scale } from 'lucide-react';
import { Logo } from '../components/Logo';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { usePageTitle } from '../lib/usePageTitle';
import { isPushSupported, isSubscribed, subscribeToPush, unsubscribeFromPush, getNotificationPermission } from '../lib/pushNotifications';
import type { Listing, NotificationPreferences } from '../lib/database.types';

const pickupTimeOptions = [
  { value: 'rendez-vous', label: 'Sur rendez-vous uniquement' },
  { value: 'weekend', label: 'Disponible le week-end' },
  { value: 'soir', label: 'Disponible en semaine après 18h' },
  { value: 'depot', label: 'Dépôt possible devant la maison' },
];

export function ProfilePage() {
  usePageTitle('Mon profil');
  const navigate = useNavigate();
  const { user, profile, signOut, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [pickupInfo, setPickupInfo] = useState('');
  const [preferredPickupTimes, setPreferredPickupTimes] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const [pushSupported, setPushSupported] = useState(false);
  const [pushSubscribed, setPushSubscribed] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState<NotificationPreferences | null>(null);
  const [pushLoading, setPushLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setPostalCode(profile.postal_code || '');
      setCity(profile.city || '');
      setBio(profile.bio || '');
      setPickupInfo(profile.pickup_info || '');
      setPreferredPickupTimes(profile.preferred_pickup_times || []);
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      fetchUserListings();
      checkPushStatus();
      fetchNotificationPreferences();
    } else {
      setLoading(false);
    }
  }, [user]);

  async function checkPushStatus() {
    const supported = await isPushSupported();
    setPushSupported(supported);
    if (supported) {
      const subscribed = await isSubscribed();
      setPushSubscribed(subscribed);
    }
  }

  async function fetchNotificationPreferences() {
    if (!user) return;

    const { data } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setNotifPrefs(data);
    }
  }

  async function fetchUserListings() {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setListings(data);
      }
    } catch {
      showToast('Impossible de charger vos annonces', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      await updateProfile({
        username: username || null,
        postal_code: postalCode || null,
        city: city || null,
        bio: bio || null,
        pickup_info: pickupInfo || null,
        preferred_pickup_times: preferredPickupTimes.length > 0 ? preferredPickupTimes : null,
      });

      showToast('Profil mis à jour', 'success');
      setEditing(false);
    } catch {
      showToast('Impossible de mettre a jour le profil', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleTogglePush() {
    if (!user) return;

    setPushLoading(true);

    if (pushSubscribed) {
      const success = await unsubscribeFromPush(user.id);
      if (success) setPushSubscribed(false);
    } else {
      const permission = await getNotificationPermission();
      if (permission === 'denied') {
        alert('Les notifications sont bloquées. Veuillez les activer dans les paramètres de votre navigateur.');
        setPushLoading(false);
        return;
      }

      const success = await subscribeToPush(user.id);
      if (success) {
        setPushSubscribed(true);

        if (!notifPrefs) {
          await supabase.from('notification_preferences').insert({
            user_id: user.id,
            new_listings_nearby: true,
            new_messages: true,
            exchange_matches: true,
            radius_km: 10,
          });
          fetchNotificationPreferences();
        }
      }
    }

    setPushLoading(false);
  }

  async function handleUpdateNotifPrefs(updates: Partial<NotificationPreferences>) {
    if (!user) return;

    if (notifPrefs) {
      await supabase
        .from('notification_preferences')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);
    } else {
      await supabase.from('notification_preferences').insert({
        user_id: user.id,
        new_listings_nearby: true,
        new_messages: true,
        exchange_matches: true,
        radius_km: 10,
        ...updates,
      });
    }

    fetchNotificationPreferences();
  }

  function togglePickupTime(value: string) {
    setPreferredPickupTimes(prev =>
      prev.includes(value)
        ? prev.filter(t => t !== value)
        : [...prev, value]
    );
  }

  async function handleDeleteListing(listingId: string) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return;

    try {
      const { error } = await supabase.from('listings').delete().eq('id', listingId);
      if (error) throw error;
      setListings((prev) => prev.filter((l) => l.id !== listingId));
      showToast('Annonce supprimée', 'success');
    } catch {
      showToast('Impossible de supprimer l\'annonce', 'error');
    }
  }

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-gradient-to-br from-primary-50 to-cream-100 border-b border-stone-200 px-4 py-6">
          <h1 className="text-2xl font-bold text-stone-900">Profil</h1>
        </header>

        <div className="px-4 py-12 text-center">
          <div className="flex justify-center mb-6">
            <Logo size={56} />
          </div>
          <h2 className="text-xl font-semibold text-stone-800 mb-2">
            Rejoignez Voisinage
          </h2>
          <p className="text-stone-600 mb-6">
            Créez un compte pour proposer, échanger et vous entraider avec vos voisins.
          </p>
          <div className="space-y-3">
            <Link to="/inscription" className="btn-primary w-full">
              Créer un compte
            </Link>
            <Link to="/connexion" className="btn-secondary w-full">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <div className="min-h-screen bg-white pb-24">
      <header className="bg-gradient-to-br from-primary-50 to-cream-100 border-b border-stone-200 px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-stone-900">Mon profil</h1>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-800"
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </header>

      <div className="px-4 py-6">
        {editing ? (
          <form onSubmit={handleSaveProfile} className="space-y-4 mb-8">
            <div>
              <label htmlFor="username" className="label">
                Nom d'utilisateur
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                placeholder="Votre pseudo"
              />
            </div>

            <div>
              <label htmlFor="postalCode" className="label">
                Code postal
              </label>
              <input
                id="postalCode"
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                className="input"
                placeholder="75001"
                maxLength={5}
                inputMode="numeric"
              />
            </div>

            <div>
              <label htmlFor="city" className="label">
                Ville
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="input"
                placeholder="Paris"
              />
            </div>

            <div>
              <label htmlFor="bio" className="label">
                À propos de mon jardin (max. 200 caractères)
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 200))}
                className="input min-h-[100px]"
                placeholder="Parlez-nous de votre jardin..."
                maxLength={200}
              />
              <p className="text-xs text-stone-500 mt-1 text-right">{bio.length}/200</p>
            </div>

            <div>
              <label className="label">Disponibilités pour le retrait</label>
              <div className="space-y-2">
                {pickupTimeOptions.map(option => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                      preferredPickupTimes.includes(option.value)
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={preferredPickupTimes.includes(option.value)}
                      onChange={() => togglePickupTime(option.value)}
                      className="w-5 h-5 rounded text-primary-600"
                    />
                    <span className="text-stone-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="pickupInfo" className="label">
                Instructions de retrait (optionnel)
              </label>
              <textarea
                id="pickupInfo"
                value={pickupInfo}
                onChange={(e) => setPickupInfo(e.target.value)}
                className="input min-h-[80px]"
                placeholder="Ex: Sonnez a la porte bleue, je suis au fond du jardin..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="btn-secondary flex-1"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex-1"
              >
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-8">
            <div className="flex items-start gap-4 mb-4">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.username || 'Profil'}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
                  <User size={40} className="text-primary-600" />
                </div>
              )}

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-stone-900">
                    {profile?.username || 'Voisin anonyme'}
                  </h2>
                  {profile?.is_verified && (
                    <CheckCircle size={20} className="text-primary-600" />
                  )}
                </div>
                {(profile?.city || profile?.postal_code) && (
                  <p className="text-stone-600 flex items-center gap-1 mt-1">
                    <MapPin size={16} />
                    {profile?.city || profile?.postal_code}
                  </p>
                )}
                <p className="text-stone-500 flex items-center gap-1 mt-1">
                  <Calendar size={16} />
                  Membre depuis {memberSince}
                </p>
              </div>
            </div>

            {profile?.bio && (
              <p className="text-stone-700 mb-4 bg-stone-50 rounded-xl p-3">
                {profile.bio}
              </p>
            )}

            <button
              onClick={() => setEditing(true)}
              className="btn-secondary w-full mb-4"
            >
              <Edit2 size={20} className="mr-2" />
              Modifier mon profil
            </button>

            {pushSupported && (
              <div className="border-t border-stone-200 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {pushSubscribed ? (
                      <Bell size={24} className="text-primary-600" />
                    ) : (
                      <BellOff size={24} className="text-stone-400" />
                    )}
                    <div>
                      <p className="font-medium text-stone-900">Notifications</p>
                      <p className="text-sm text-stone-500">
                        {pushSubscribed ? 'Activées' : 'Désactivées'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleTogglePush}
                    disabled={pushLoading}
                    className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                      pushSubscribed
                        ? 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    {pushLoading ? '...' : pushSubscribed ? 'Désactiver' : 'Activer'}
                  </button>
                </div>

                {pushSubscribed && (
                  <div className="space-y-2 bg-stone-50 rounded-xl p-3">
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-stone-700">Nouveaux produits à proximité</span>
                      <input
                        type="checkbox"
                        checked={notifPrefs?.new_listings_nearby ?? true}
                        onChange={(e) => handleUpdateNotifPrefs({ new_listings_nearby: e.target.checked })}
                        className="w-5 h-5 rounded text-primary-600"
                      />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-stone-700">Nouveaux messages</span>
                      <input
                        type="checkbox"
                        checked={notifPrefs?.new_messages ?? true}
                        onChange={(e) => handleUpdateNotifPrefs({ new_messages: e.target.checked })}
                        className="w-5 h-5 rounded text-primary-600"
                      />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-stone-700">Nouveaux matches d'échange</span>
                      <input
                        type="checkbox"
                        checked={notifPrefs?.exchange_matches ?? true}
                        onChange={(e) => handleUpdateNotifPrefs({ exchange_matches: e.target.checked })}
                        className="w-5 h-5 rounded text-primary-600"
                      />
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div>
          <h3 className="text-xl font-semibold text-stone-900 mb-4">
            Mes annonces ({listings.length})
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-600 border-t-transparent"></div>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-8 bg-stone-50 rounded-xl">
              <p className="text-stone-600 mb-4">
                Vous n'avez pas encore d'annonce.
              </p>
              <Link to="/creer" className="btn-primary">
                Créer ma première annonce
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className="card flex items-center gap-4 p-4"
                >
                  {listing.image_url ? (
                    <img
                      src={listing.image_url}
                      alt={listing.title}
                      className="w-16 h-16 rounded-lg object-cover"
                      onError={(e) => {
                        const el = e.currentTarget;
                        el.style.display = 'none';
                        el.parentElement!.insertAdjacentHTML('afterbegin', '<div class="w-16 h-16 rounded-lg bg-stone-100 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-stone-400"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 17 3.5s0 0 0 0C17 3.5 22 9 22 13.5A7.5 7.5 0 0 1 11 20z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg></div>');
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-stone-100 flex items-center justify-center">
                      <Leaf size={24} className="text-stone-400" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/annonce/${listing.id}`}
                      className="font-medium text-stone-900 hover:text-primary-600 line-clamp-1"
                    >
                      {listing.title}
                    </Link>
                    <p className="text-sm text-stone-500">
                      {listing.status === 'active' ? 'Active' : listing.status}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteListing(listing.id)}
                    className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-stone-200 pt-6">
          <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">Informations légales</h3>
          <div className="space-y-1">
            <Link to="/conditions-utilisation" className="flex items-center gap-3 py-2.5 text-stone-600 hover:text-primary-600 transition-colors">
              <FileText size={18} />
              <span>Conditions générales d'utilisation</span>
            </Link>
            <Link to="/politique-confidentialite" className="flex items-center gap-3 py-2.5 text-stone-600 hover:text-primary-600 transition-colors">
              <Shield size={18} />
              <span>Politique de confidentialité</span>
            </Link>
            <Link to="/mentions-legales" className="flex items-center gap-3 py-2.5 text-stone-600 hover:text-primary-600 transition-colors">
              <Scale size={18} />
              <span>Mentions légales</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
