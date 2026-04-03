import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, CheckCircle, User, Leaf, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { usePageTitle } from '../lib/usePageTitle';
import { ListingCard } from '../components/ListingCard';
import { ExchangeWishCard } from '../components/ExchangeWishCard';
import type { Profile, ListingWithDetails, ExchangeWishWithDetails } from '../lib/database.types';

export function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [listings, setListings] = useState<ListingWithDetails[]>([]);
  const [wishes, setWishes] = useState<ExchangeWishWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'listings' | 'exchanges'>('listings');
  usePageTitle(profile?.username || 'Profil');

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  async function fetchData() {
    setLoading(true);

    try {
      const [profileResult, listingsResult, wishesResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .maybeSingle(),
        supabase
          .from('listings')
          .select(`
            *,
            category:categories(*),
            profile:profiles(*)
          `)
          .eq('user_id', id)
          .eq('status', 'active')
          .order('created_at', { ascending: false }),
        supabase
          .from('exchange_wishes')
          .select(`
            *,
            offer_category:categories!exchange_wishes_offer_category_id_fkey(*),
            seek_category:categories!exchange_wishes_seek_category_id_fkey(*),
            profile:profiles(*)
          `)
          .eq('user_id', id)
          .eq('is_active', true)
          .order('created_at', { ascending: false }),
      ]);

      if (profileResult.data) setProfile(profileResult.data);
      if (listingsResult.data) setListings(listingsResult.data as ListingWithDetails[]);
      if (wishesResult.data) setWishes(wishesResult.data as ExchangeWishWithDetails[]);
    } catch {
      showToast('Impossible de charger le profil', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleContact() {
    if (!user || !profile) {
      navigate('/connexion', { state: { from: `/voisin/${id}` } });
      return;
    }

    try {
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('id')
        .is('listing_id', null)
        .or(`and(buyer_id.eq.${user.id},seller_id.eq.${profile.id}),and(buyer_id.eq.${profile.id},seller_id.eq.${user.id})`)
        .maybeSingle();

      if (existingConversation) {
        navigate(`/messages/${existingConversation.id}`);
        return;
      }

      const { data: newConversation, error } = await supabase
        .from('conversations')
        .insert({
          listing_id: null,
          buyer_id: user.id,
          seller_id: profile.id,
        })
        .select('id')
        .single();

      if (error) throw error;

      if (newConversation) {
        navigate(`/messages/${newConversation.id}`);
      }
    } catch {
      showToast('Impossible de contacter ce voisin', 'error');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="px-4 py-12 text-center">
        <h2 className="text-xl font-semibold text-stone-700 mb-4">
          Profil introuvable
        </h2>
        <Link to="/" className="btn-primary">
          Retour a l'accueil
        </Link>
      </div>
    );
  }

  const memberSince = new Date(profile.created_at).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });

  const isOwnProfile = user?.id === profile.id;

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      <header className="sticky top-0 bg-white border-b border-stone-200 px-4 py-3 z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-stone-600 hover:text-stone-800"
        >
          <ArrowLeft size={24} />
          <span className="text-lg">Retour</span>
        </button>
      </header>

      <div className="bg-white border-b border-stone-200">
        <div className="px-4 py-6">
          <div className="flex items-start gap-4">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.username || 'Voisin'}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
                <User size={40} className="text-primary-600" />
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-stone-900">
                  {profile.username || 'Voisin'}
                </h1>
                {profile.is_verified && (
                  <CheckCircle size={24} className="text-primary-600" />
                )}
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-stone-600">
                {profile.city && (
                  <span className="flex items-center gap-1">
                    <MapPin size={16} />
                    {profile.city}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  Membre depuis {memberSince}
                </span>
              </div>
            </div>
          </div>

          {profile.bio && (
            <p className="mt-4 text-stone-700">{profile.bio}</p>
          )}

          {profile.garden_photo_url && (
            <div className="mt-4">
              <img
                src={profile.garden_photo_url}
                alt="Jardin"
                className="w-full h-48 object-cover rounded-xl"
              />
            </div>
          )}

          {profile.pickup_info && (
            <div className="mt-4 bg-stone-50 rounded-xl p-4">
              <p className="text-sm text-stone-500 mb-1">Informations de retrait</p>
              <p className="text-stone-700">{profile.pickup_info}</p>
            </div>
          )}

          {!isOwnProfile && (
            <button
              onClick={handleContact}
              className="btn-primary w-full mt-4"
            >
              <MessageCircle size={20} className="mr-2" />
              Contacter
            </button>
          )}
        </div>

        <div className="flex border-t border-stone-200">
          <button
            onClick={() => setActiveTab('listings')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'listings'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            Annonces ({listings.length})
          </button>
          <button
            onClick={() => setActiveTab('exchanges')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'exchanges'
                ? 'text-echanger border-b-2 border-echanger'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            Echanges ({wishes.length})
          </button>
        </div>
      </div>

      <div className="px-4 py-4">
        {activeTab === 'listings' && (
          <>
            {listings.length === 0 ? (
              <div className="text-center py-8">
                <Leaf size={48} className="text-stone-300 mx-auto mb-4" />
                <p className="text-stone-500">Aucune annonce active</p>
              </div>
            ) : (
              <div className="space-y-4">
                {listings.map(listing => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'exchanges' && (
          <>
            {wishes.length === 0 ? (
              <div className="text-center py-8">
                <Leaf size={48} className="text-stone-300 mx-auto mb-4" />
                <p className="text-stone-500">Aucun souhait d'echange actif</p>
              </div>
            ) : (
              <div className="space-y-4">
                {wishes.map(wish => (
                  <ExchangeWishCard key={wish.id} wish={wish} showProfile={false} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
