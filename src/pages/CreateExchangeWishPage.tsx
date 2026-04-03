import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShoppingBasket, Wrench, HeartHandshake, Shirt, Package, CheckCircle, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { usePageTitle } from '../lib/usePageTitle';
import type { Category } from '../lib/database.types';

const categoryIcons: Record<string, typeof ShoppingBasket> = {
  'shopping-basket': ShoppingBasket,
  'wrench': Wrench,
  'heart-handshake': HeartHandshake,
  'shirt': Shirt,
  'package': Package,
};

const radiusOptions = [5, 10, 25, 50];

export function CreateExchangeWishPage() {
  usePageTitle('Nouveau souhait d\'echange');
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [matchesFound, setMatchesFound] = useState(0);

  const [offerCategoryId, setOfferCategoryId] = useState('');
  const [offerDescription, setOfferDescription] = useState('');
  const [seekCategoryId, setSeekCategoryId] = useState('');
  const [seekDescription, setSeekDescription] = useState('');
  const [radiusKm, setRadiusKm] = useState(10);

  useEffect(() => {
    if (!user) return;
    fetchCategories();
  }, [user, navigate]);

  async function fetchCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order');
    if (data) setCategories(data);
  }

  async function findPotentialMatches() {
    if (!offerCategoryId || !seekCategoryId) return 0;

    const { count } = await supabase
      .from('exchange_wishes')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('offer_category_id', seekCategoryId)
      .eq('seek_category_id', offerCategoryId)
      .neq('user_id', user!.id);

    return count || 0;
  }

  useEffect(() => {
    if (offerCategoryId && seekCategoryId) {
      findPotentialMatches().then(setMatchesFound);
    } else {
      setMatchesFound(0);
    }
  }, [offerCategoryId, seekCategoryId]);

  async function handleSubmit() {
    if (!user || !profile) return;

    setLoading(true);

    const { data: wish, error } = await supabase.from('exchange_wishes').insert({
      user_id: user.id,
      offer_category_id: offerCategoryId,
      offer_description: offerDescription,
      seek_category_id: seekCategoryId,
      seek_description: seekDescription,
      postal_code: profile.postal_code || '',
      city: profile.city || null,
      radius_km: radiusKm,
    }).select('id').single();

    if (!error && wish) {
      const offerCategoryName = categories.find(c => c.id === offerCategoryId)?.name || 'produit';
      const seekCategoryName = categories.find(c => c.id === seekCategoryId)?.name || 'produit';

      await supabase.from('listings').insert({
        user_id: user.id,
        category_id: offerCategoryId,
        title: `Echange: ${offerDescription}`,
        description: `J'offre: ${offerDescription}\nJe cherche: ${seekDescription}`,
        quantity: null,
        listing_type: 'echanger',
        price: null,
        image_url: null,
        postal_code: profile.postal_code || '',
        city: profile.city || null,
        is_private_garden_confirmed: profile.is_private_garden,
        latitude: profile.latitude,
        longitude: profile.longitude,
        expires_at: null,
      });

      const { data: matchingWishes } = await supabase
        .from('exchange_wishes')
        .select('id')
        .eq('is_active', true)
        .eq('offer_category_id', seekCategoryId)
        .eq('seek_category_id', offerCategoryId)
        .neq('user_id', user.id);

      if (matchingWishes && matchingWishes.length > 0) {
        const matchInserts = matchingWishes.map(other => ({
          wish_a_id: wish.id,
          wish_b_id: other.id,
        }));

        await supabase.from('exchange_matches').insert(matchInserts);
        setMatchesFound(matchingWishes.length);
      }

      await supabase.from('analytics_events').insert({
        event_type: 'exchange_wish_created',
        event_data: {
          offer_category: offerCategoryName,
          seek_category: seekCategoryName,
          radius_km: radiusKm,
          matches_found: matchingWishes?.length || 0,
        },
        postal_code_prefix: profile.postal_code?.substring(0, 2) || null,
      });

      setSuccess(true);
      setTimeout(() => navigate('/echanger'), 2500);
    }

    setLoading(false);
  }

  if (!user) {
    navigate('/connexion', { state: { from: '/echanger/nouveau' } });
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="bg-echanger-light w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-echanger" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">
            Souhait publie !
          </h2>
          {matchesFound > 0 ? (
            <p className="text-lg text-echanger font-medium">
              {matchesFound} match{matchesFound > 1 ? 'es' : ''} trouve{matchesFound > 1 ? 's' : ''} !
            </p>
          ) : (
            <p className="text-lg text-stone-600">
              Nous vous notifierons des que quelqu'un correspondra.
            </p>
          )}
        </div>
      </div>
    );
  }

  const isValid = offerCategoryId && offerDescription.trim() && seekCategoryId && seekDescription.trim();

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-gradient-to-r from-primary-50 to-cream-100 border-b border-stone-200 px-4 py-3 z-10 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-stone-600 hover:text-stone-800"
        >
          <ArrowLeft size={24} />
          <span className="text-lg">Retour</span>
        </button>
      </header>

      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-stone-900 mb-2 text-center">
          Nouveau souhait d'echange
        </h1>
        <p className="text-stone-600 text-center mb-8">
          Indiquez ce que vous offrez et ce que vous cherchez
        </p>

        <div className="space-y-8">
          <div className="bg-echanger-light rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-echanger-dark mb-4 flex items-center gap-2">
              <span className="bg-echanger text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">1</span>
              J'offre
            </h2>

            <div className="mb-4">
              <label className="label">Categorie</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => {
                  const Icon = categoryIcons[cat.icon] || Leaf;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setOfferCategoryId(cat.id)}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-colors ${
                        offerCategoryId === cat.id
                          ? 'border-echanger bg-white'
                          : 'border-transparent bg-white/50 hover:bg-white'
                      }`}
                    >
                      <Icon size={20} className={offerCategoryId === cat.id ? 'text-echanger' : 'text-stone-500'} />
                      <span className={`font-medium ${offerCategoryId === cat.id ? 'text-echanger-dark' : 'text-stone-700'}`}>
                        {cat.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="offerDescription" className="label">
                Description (max. 100 caracteres)
              </label>
              <input
                id="offerDescription"
                type="text"
                value={offerDescription}
                onChange={(e) => setOfferDescription(e.target.value.slice(0, 100))}
                className="input bg-white"
                placeholder="Ex: Tomates cerises, environ 2kg"
                maxLength={100}
              />
              <p className="text-xs text-echanger-dark/60 mt-1 text-right">
                {offerDescription.length}/100
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="bg-stone-100 p-3 rounded-full">
              <ArrowRight size={24} className="text-stone-400" />
            </div>
          </div>

          <div className="bg-primary-50 rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-primary-800 mb-4 flex items-center gap-2">
              <span className="bg-primary-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">2</span>
              Je cherche
            </h2>

            <div className="mb-4">
              <label className="label">Categorie</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => {
                  const Icon = categoryIcons[cat.icon] || Leaf;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSeekCategoryId(cat.id)}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-colors ${
                        seekCategoryId === cat.id
                          ? 'border-primary-500 bg-white'
                          : 'border-transparent bg-white/50 hover:bg-white'
                      }`}
                    >
                      <Icon size={20} className={seekCategoryId === cat.id ? 'text-primary-600' : 'text-stone-500'} />
                      <span className={`font-medium ${seekCategoryId === cat.id ? 'text-primary-700' : 'text-stone-700'}`}>
                        {cat.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="seekDescription" className="label">
                Description (max. 100 caracteres)
              </label>
              <input
                id="seekDescription"
                type="text"
                value={seekDescription}
                onChange={(e) => setSeekDescription(e.target.value.slice(0, 100))}
                className="input bg-white"
                placeholder="Ex: Courgettes ou aubergines"
                maxLength={100}
              />
              <p className="text-xs text-primary-800/60 mt-1 text-right">
                {seekDescription.length}/100
              </p>
            </div>
          </div>

          <div>
            <label className="label flex items-center gap-2">
              <MapPin size={18} />
              Rayon de recherche
            </label>
            <div className="flex gap-2">
              {radiusOptions.map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRadiusKm(r)}
                  className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                    radiusKm === r
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {r} km
                </button>
              ))}
            </div>
          </div>

          {matchesFound > 0 && (
            <div className="bg-echanger-light border border-echanger/20 rounded-xl p-4 text-center">
              <p className="text-echanger-dark font-medium">
                {matchesFound} partenaire{matchesFound > 1 ? 's' : ''} potentiel{matchesFound > 1 ? 's' : ''} trouve{matchesFound > 1 ? 's' : ''} !
              </p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="btn-echanger w-full text-xl"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></span>
            ) : (
              'Publier mon souhait'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
