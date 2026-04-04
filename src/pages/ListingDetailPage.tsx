import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, MapPin, User, Calendar, MessageCircle, ShoppingBasket, Wrench, HeartHandshake, Shirt, Package, Leaf, Flag, CheckCircle, Clock, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { usePageTitle } from '../lib/usePageTitle';
import { ReportModal } from '../components/ReportModal';
import { SkeletonListingDetail } from '../components/SkeletonDetail';
import type { ListingWithDetails } from '../lib/database.types';

const categoryIcons: Record<string, typeof ShoppingBasket> = {
  'shopping-basket': ShoppingBasket,
  'wrench': Wrench,
  'heart-handshake': HeartHandshake,
  'shirt': Shirt,
  'package': Package,
};

const typeLabels: Record<string, string> = {
  donner: 'À donner gratuitement',
  echanger: 'À échanger',
  vendre: 'À vendre',
  preter: 'À prêter',
  cherche: 'Recherche',
};

const typeStyles: Record<string, string> = {
  donner: 'bg-donner-light text-donner-dark',
  echanger: 'bg-echanger-light text-echanger-dark',
  vendre: 'bg-vendre-light text-vendre-dark',
  preter: 'bg-preter-light text-preter-dark',
  cherche: 'bg-cherche-light text-cherche-dark',
};

const pickupTimeLabels: Record<string, string> = {
  'rendez-vous': 'Sur rendez-vous',
  'weekend': 'Week-end',
  'soir': 'Soir en semaine',
  'depot': 'Depot possible',
};

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [listing, setListing] = useState<ListingWithDetails | null>(null);
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contactLoading, setContactLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  usePageTitle(listing?.title);

  useEffect(() => {
    if (id) fetchListing();
  }, [id]);

  async function fetchListing() {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          category:categories(*),
          profile:profiles(*)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setListing(data as ListingWithDetails);

        supabase.from('analytics_events').insert({
          event_type: 'listing_viewed',
          event_data: { category: data.category?.name },
          postal_code_prefix: data.postal_code?.substring(0, 2) || null,
        });
      }
    } catch {
      showToast('Impossible de charger l\'annonce', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleContact() {
    if (!user) {
      navigate('/connexion', { state: { from: `/annonce/${id}` } });
      return;
    }

    if (!listing) return;

    setContactLoading(true);

    try {
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('listing_id', listing.id)
        .eq('buyer_id', user.id)
        .eq('seller_id', listing.user_id)
        .maybeSingle();

      if (existingConversation) {
        navigate(`/messages/${existingConversation.id}`);
        return;
      }

      const { data: newConversation, error } = await supabase
        .from('conversations')
        .insert({
          listing_id: listing.id,
          buyer_id: user.id,
          seller_id: listing.user_id,
        })
        .select('id')
        .single();

      if (error) throw error;

      if (newConversation) {
        const defaultMessage = `Bonjour, je suis interesse(e) par votre annonce "${listing.title}". Est-elle toujours disponible ?`;

        await supabase.from('messages').insert({
          conversation_id: newConversation.id,
          sender_id: user.id,
          content: defaultMessage,
        });

        navigate(`/messages/${newConversation.id}`);
      }
    } catch {
      showToast('Impossible de contacter le vendeur', 'error');
    } finally {
      setContactLoading(false);
    }
  }

  function handleReportClick() {
    if (!user) {
      navigate('/connexion', { state: { from: `/annonce/${id}` } });
      return;
    }
    setShowReportModal(true);
  }

  if (loading) {
    return <SkeletonListingDetail />;
  }

  if (!listing) {
    return (
      <div className="px-4 py-12 text-center">
        <h2 className="text-xl font-semibold text-stone-700 mb-4">
          Annonce introuvable
        </h2>
        <Link to="/" className="btn-primary">
          Retour a l'accueil
        </Link>
      </div>
    );
  }

  const Icon = categoryIcons[listing.category?.icon] || Leaf;
  const isOwner = user?.id === listing.user_id;
  const createdDate = new Date(listing.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-white">
      {listing && (
        <Helmet>
          <title>{`${listing.title} — ${typeLabels[listing.listing_type]} à ${listing.city || listing.postal_code} | Voisinage.app`}</title>
          <meta name="description" content={`${typeLabels[listing.listing_type]} à ${listing.city || listing.postal_code}${listing.description ? ` — ${listing.description.slice(0, 140)}` : ''}. Entraide locale entre voisins sur Voisinage.app`} />
          <meta property="og:title" content={`${listing.title} — ${typeLabels[listing.listing_type]} à ${listing.city || listing.postal_code}`} />
          <meta property="og:description" content={`${typeLabels[listing.listing_type]}${listing.description ? ` — ${listing.description.slice(0, 140)}` : ''}`} />
          <meta property="og:type" content="product" />
          <meta property="og:url" content={`https://voisinage.app/annonce/${listing.id}`} />
          {listing.image_url && <meta property="og:image" content={listing.image_url} />}
          <link rel="canonical" href={`https://voisinage.app/annonce/${listing.id}`} />
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': listing.listing_type === 'vendre' ? 'Product' : 'Offer',
              name: listing.title,
              description: listing.description || `${typeLabels[listing.listing_type]} à ${listing.city || listing.postal_code}`,
              ...(listing.image_url ? { image: listing.image_url } : {}),
              ...(listing.listing_type === 'vendre' && listing.price
                ? {
                    offers: {
                      '@type': 'Offer',
                      price: listing.price,
                      priceCurrency: 'EUR',
                      availability: 'https://schema.org/InStock',
                      areaServed: { '@type': 'City', name: listing.city || listing.postal_code },
                    },
                  }
                : {
                    price: '0',
                    priceCurrency: 'EUR',
                    areaServed: { '@type': 'City', name: listing.city || listing.postal_code },
                  }),
              seller: {
                '@type': 'Person',
                name: listing.profile?.username || 'Voisin',
                address: { '@type': 'PostalAddress', addressLocality: listing.city || '', postalCode: listing.postal_code || '' },
              },
            })}
          </script>
        </Helmet>
      )}

      <header className="sticky top-0 bg-gradient-to-r from-primary-50 to-cream-100 border-b border-stone-200 px-4 py-3 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-800"
          >
            <ArrowLeft size={24} />
            <span className="text-lg">Retour</span>
          </button>
          {!isOwner && (
            <button
              onClick={handleReportClick}
              className="flex items-center gap-1 text-stone-500 hover:text-red-600 text-sm"
            >
              <Flag size={18} />
              <span>Signaler</span>
            </button>
          )}
        </div>
      </header>

      {listing.image_url && !imgError ? (
        <div className="aspect-video bg-stone-100">
          <img
            src={listing.image_url}
            alt={listing.title}
            loading="eager"
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div className="aspect-video bg-stone-100 flex items-center justify-center">
          <Icon size={80} className="text-stone-300" />
        </div>
      )}

      <div className="px-4 py-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <h1 className="text-2xl font-bold text-stone-900">{listing.title}</h1>
          <span className={`px-4 py-2 rounded-full text-base font-medium ${typeStyles[listing.listing_type]}`}>
            {typeLabels[listing.listing_type]}
          </span>
        </div>

        {listing.listing_type === 'vendre' && listing.price && (
          <p className="text-3xl font-bold text-vendre mb-4">
            {listing.price.toFixed(2)} €
          </p>
        )}

        <div className="flex flex-wrap gap-4 text-stone-600 mb-6">
          <div className="flex items-center gap-2">
            <MapPin size={20} />
            <span>{listing.city || listing.postal_code}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={20} />
            <span>{createdDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon size={20} />
            <span>{listing.category?.name}</span>
          </div>
        </div>

        {listing.quantity && (
          <div className="bg-stone-50 rounded-xl p-4 mb-6">
            <p className="text-lg">
              <strong>Quantité :</strong> {listing.quantity}
            </p>
          </div>
        )}

        {listing.description && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-stone-800 mb-2">Description</h2>
            <p className="text-stone-700 whitespace-pre-line">{listing.description}</p>
          </div>
        )}

        <div className="border-t border-stone-200 pt-6 mb-6">
          <h2 className="text-xl font-semibold text-stone-800 mb-4">Proposé par</h2>
          <Link
            to={`/voisin/${listing.user_id}`}
            className="flex items-center gap-4 hover:bg-stone-50 -mx-2 px-2 py-2 rounded-xl transition-colors"
          >
            {listing.profile?.avatar_url ? (
              <img
                src={listing.profile.avatar_url}
                alt={listing.profile.username || 'Utilisateur'}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
                <User size={28} className="text-primary-600" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-lg font-medium text-stone-900 flex items-center gap-2">
                {listing.profile?.username || 'Voisin anonyme'}
                {listing.profile?.is_verified && (
                  <CheckCircle size={18} className="text-primary-600" />
                )}
              </p>
              <p className="text-stone-500">
                {listing.profile?.city || listing.postal_code}
              </p>
            </div>
          </Link>
        </div>

        {(listing.profile?.preferred_pickup_times?.length || listing.profile?.pickup_info) && (
          <div className="border-t border-stone-200 pt-6 mb-6">
            <h2 className="text-xl font-semibold text-stone-800 mb-4">Retrait</h2>

            {listing.profile?.preferred_pickup_times && listing.profile.preferred_pickup_times.length > 0 && (
              <div className="flex items-start gap-3 mb-4">
                <Clock size={20} className="text-stone-500 mt-0.5 flex-shrink-0" />
                <div className="flex flex-wrap gap-2">
                  {listing.profile.preferred_pickup_times.map(time => (
                    <span
                      key={time}
                      className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                    >
                      {pickupTimeLabels[time] || time}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {listing.profile?.pickup_info && (
              <div className="flex items-start gap-3">
                <Info size={20} className="text-stone-500 mt-0.5 flex-shrink-0" />
                <p className="text-stone-700">{listing.profile.pickup_info}</p>
              </div>
            )}
          </div>
        )}

        {isOwner && (
          <Link
            to="/profil"
            className="block bg-primary-50 rounded-xl p-4 text-center hover:bg-primary-100 transition-colors"
          >
            <p className="text-primary-800">C'est votre annonce — Gérer dans Mon profil</p>
          </Link>
        )}
      </div>

      <div className="px-4 py-4 bg-stone-50 border-t border-stone-200">
        <p className="text-sm text-stone-500 text-center">
          Les échanges se font en personne, entre voisins de confiance.
        </p>
      </div>

      {!isOwner && (
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-3 safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <button
            onClick={handleContact}
            disabled={contactLoading}
            className="btn-primary w-full text-xl"
          >
            {contactLoading ? (
              <span className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></span>
            ) : (
              <>
                <MessageCircle size={24} className="mr-2" />
                Contacter
              </>
            )}
          </button>
        </div>
      )}

      {showReportModal && user && (
        <ReportModal
          listingId={listing.id}
          userId={user.id}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}
