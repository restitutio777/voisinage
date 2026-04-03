import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, ArrowLeftRight, Search, ShoppingBasket, Wrench, HeartHandshake, Shirt, Package, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { usePageTitle } from '../lib/usePageTitle';
import { ExchangeWishCard } from '../components/ExchangeWishCard';
import { ExchangeMatchCard } from '../components/ExchangeMatchCard';
import { EmptyState } from '../components/EmptyState';
import type { Category, ExchangeWishWithDetails, ExchangeMatchWithDetails } from '../lib/database.types';

const categoryIcons: Record<string, typeof ShoppingBasket> = {
  'shopping-basket': ShoppingBasket,
  'wrench': Wrench,
  'heart-handshake': HeartHandshake,
  'shirt': Shirt,
  'package': Package,
};

type TabType = 'matches' | 'my-wishes' | 'discover';

export function ExchangePage() {
  usePageTitle('Echanger');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('matches');
  const [categories, setCategories] = useState<Category[]>([]);
  const [myWishes, setMyWishes] = useState<ExchangeWishWithDetails[]>([]);
  const [matches, setMatches] = useState<ExchangeMatchWithDetails[]>([]);
  const [nearbyWishes, setNearbyWishes] = useState<ExchangeWishWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    fetchCategories();
    if (user) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  async function fetchCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order');
    if (data) setCategories(data);
  }

  async function fetchData() {
    setLoading(true);

    try {
      const [wishesResult, matchesResult, nearbyResult] = await Promise.all([
        supabase
          .from('exchange_wishes')
          .select(`
            *,
            offer_category:categories!exchange_wishes_offer_category_id_fkey(*),
            seek_category:categories!exchange_wishes_seek_category_id_fkey(*),
            profile:profiles(*)
          `)
          .eq('user_id', user!.id)
          .order('created_at', { ascending: false }),

        supabase
          .from('exchange_matches')
          .select(`
            *,
            wish_a:exchange_wishes!exchange_matches_wish_a_id_fkey(
              *,
              offer_category:categories!exchange_wishes_offer_category_id_fkey(*),
              seek_category:categories!exchange_wishes_seek_category_id_fkey(*),
              profile:profiles(*)
            ),
            wish_b:exchange_wishes!exchange_matches_wish_b_id_fkey(
              *,
              offer_category:categories!exchange_wishes_offer_category_id_fkey(*),
              seek_category:categories!exchange_wishes_seek_category_id_fkey(*),
              profile:profiles(*)
            )
          `)
          .order('created_at', { ascending: false }),

        supabase
          .from('exchange_wishes')
          .select(`
            *,
            offer_category:categories!exchange_wishes_offer_category_id_fkey(*),
            seek_category:categories!exchange_wishes_seek_category_id_fkey(*),
            profile:profiles(*)
          `)
          .eq('is_active', true)
          .neq('user_id', user!.id)
          .order('created_at', { ascending: false })
          .limit(20),
      ]);

      if (wishesResult.data) setMyWishes(wishesResult.data as ExchangeWishWithDetails[]);
      if (matchesResult.data) setMatches(matchesResult.data as ExchangeMatchWithDetails[]);
      if (nearbyResult.data) setNearbyWishes(nearbyResult.data as ExchangeWishWithDetails[]);
    } catch {
      showToast('Impossible de charger les donnees d\'echange', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeactivateWish(wishId: string) {
    try {
      const { error } = await supabase
        .from('exchange_wishes')
        .update({ is_active: false })
        .eq('id', wishId);
      if (error) throw error;
      fetchData();
    } catch {
      showToast('Impossible de desactiver le souhait', 'error');
    }
  }

  async function handleContactFromMatch(match: ExchangeMatchWithDetails) {
    if (!user) return;

    try {
      const otherWish = match.wish_a.user_id === user.id ? match.wish_b : match.wish_a;

      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('id')
        .is('listing_id', null)
        .or(`and(buyer_id.eq.${user.id},seller_id.eq.${otherWish.user_id}),and(buyer_id.eq.${otherWish.user_id},seller_id.eq.${user.id})`)
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
          seller_id: otherWish.user_id,
        })
        .select('id')
        .single();

      if (error) throw error;

      if (newConversation) {
        const myWish = match.wish_a.user_id === user.id ? match.wish_a : match.wish_b;

        const defaultMessage = `Bonjour ! J'ai vu que nous pourrions echanger. Je propose "${myWish.offer_description}" et je cherche "${myWish.seek_description}". Seriez-vous interesse(e) ?`;

        await supabase.from('messages').insert({
          conversation_id: newConversation.id,
          sender_id: user.id,
          content: defaultMessage,
        });

        await supabase
          .from('exchange_matches')
          .update({ status: 'contacted' })
          .eq('id', match.id);

        navigate(`/messages/${newConversation.id}`);
      }
    } catch {
      showToast('Impossible de contacter le partenaire d\'echange', 'error');
    }
  }

  const filteredNearbyWishes = selectedCategory
    ? nearbyWishes.filter(w => w.offer_category_id === selectedCategory || w.seek_category_id === selectedCategory)
    : nearbyWishes;

  const tabs = [
    { id: 'matches' as const, label: 'Matches', count: matches.length },
    { id: 'my-wishes' as const, label: 'Mes souhaits', count: myWishes.length },
    { id: 'discover' as const, label: 'Decouvrir', count: null },
  ];

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      <header className="bg-white border-b border-stone-200 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Echanger</h1>
            <p className="text-stone-600">Trouvez des partenaires d'echange</p>
          </div>
          {user && (
            <Link
              to="/echanger/nouveau"
              className="btn-echanger flex items-center gap-2"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Nouveau souhait</span>
            </Link>
          )}
        </div>

        {user && (
          <div className="flex gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-echanger text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {tab.label}
                {tab.count !== null && tab.count > 0 && (
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-white/20' : 'bg-echanger/10 text-echanger'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </header>

      {!user ? (
        <div className="px-4 py-12 text-center">
          <div className="bg-echanger-light w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ArrowLeftRight size={40} className="text-echanger" />
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-3">
            Échangez entre voisins
          </h2>
          <p className="text-stone-600 mb-8 max-w-sm mx-auto">
            Créez un compte pour publier vos souhaits d'échange et trouver des partenaires près de chez vous.
          </p>
          <div className="space-y-3 max-w-xs mx-auto">
            <Link to="/inscription" state={{ from: '/echanger' }} className="btn-primary w-full">Créer un compte</Link>
            <Link to="/connexion" state={{ from: '/echanger' }} className="btn-secondary w-full">Se connecter</Link>
          </div>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-echanger border-t-transparent"></div>
        </div>
      ) : (
        <div className="px-4 py-4">
          {activeTab === 'matches' && (
            <div>
              {matches.length === 0 ? (
                <EmptyState
                  icon={Search}
                  title="Pas encore de match"
                  description="Creez un souhait d'echange pour trouver des partenaires."
                  actionLabel="Creer un souhait"
                  actionTo="/echanger/nouveau"
                />
              ) : (
                <div className="space-y-4">
                  {matches.map((match, index) => (
                    <div
                      key={match.id}
                      className="animate-scale-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <ExchangeMatchCard
                        match={match}
                        currentUserId={user.id}
                        onContact={() => handleContactFromMatch(match)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'my-wishes' && (
            <div>
              {myWishes.length === 0 ? (
                <EmptyState
                  icon={RefreshCw}
                  title="Aucun souhait d'echange"
                  description="Publiez ce que vous offrez et ce que vous cherchez."
                  actionLabel="Creer mon premier souhait"
                  actionTo="/echanger/nouveau"
                />
              ) : (
                <div className="space-y-4">
                  {myWishes.map((wish, index) => (
                    <div
                      key={wish.id}
                      className="relative animate-scale-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <ExchangeWishCard wish={wish} showProfile={false} />
                      {wish.is_active && (
                        <button
                          onClick={() => handleDeactivateWish(wish.id)}
                          className="absolute top-2 right-2 text-xs text-stone-500 hover:text-red-600 bg-white px-2 py-1 rounded-lg shadow-sm"
                        >
                          Desactiver
                        </button>
                      )}
                      {!wish.is_active && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
                          <span className="text-stone-500 font-medium">Desactive</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'discover' && (
            <div>
              <div className="mb-4 overflow-x-auto pb-2 -mx-4 px-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      !selectedCategory
                        ? 'bg-echanger text-white'
                        : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    Tous
                  </button>
                  {categories.map(cat => {
                    const Icon = categoryIcons[cat.icon] || Leaf;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                          selectedCategory === cat.id
                            ? 'bg-echanger text-white'
                            : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <Icon size={16} />
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {filteredNearbyWishes.length === 0 ? (
                <EmptyState
                  icon={Search}
                  title="Aucun souhait trouve"
                  description={selectedCategory ? 'Essayez une autre categorie.' : 'Soyez le premier a publier un souhait !'}
                />
              ) : (
                <div className="space-y-4">
                  {filteredNearbyWishes.map((wish, index) => (
                    <div
                      key={wish.id}
                      className="animate-scale-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <ExchangeWishCard wish={wish} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
