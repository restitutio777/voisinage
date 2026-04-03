import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, MapPin, Gift, RefreshCw, Euro, Clock, X, ShoppingBasket, Wrench, HeartHandshake, Shirt, Package, Leaf, ChevronDown, Navigation } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';
import { useDebounce } from '../lib/useDebounce';
import { usePageTitle } from '../lib/usePageTitle';
import { geocodePostalCode } from '../lib/geocoding';
import type { ListingWithDetails, Category, ListingType, ListingWithDistance } from '../lib/database.types';
import { ListingCard } from '../components/ListingCard';
import { SkeletonCard, SkeletonFilterBar } from '../components/SkeletonCard';
import { HomePageFooter } from '../components/HomePageFooter';
import { EmptyState } from '../components/EmptyState';
import { Logo } from '../components/Logo';

const categoryIcons: Record<string, typeof ShoppingBasket> = {
  'shopping-basket': ShoppingBasket,
  'wrench': Wrench,
  'heart-handshake': HeartHandshake,
  'shirt': Shirt,
  'package': Package,
};

const PAGE_SIZE = 20;
const DEFAULT_RADIUS_KM = 25;

const RADIUS_OPTIONS = [
  { value: 10, label: '10 km' },
  { value: 25, label: '25 km' },
  { value: 50, label: '50 km' },
  { value: 100, label: '100 km' },
];

const TYPE_OPTIONS: { value: ListingType | 'all'; label: string; icon: typeof Gift; activeClass: string }[] = [
  { value: 'donner', label: 'Donner', icon: Gift, activeClass: 'bg-donner text-white' },
  { value: 'echanger', label: 'Échanger', icon: RefreshCw, activeClass: 'bg-echanger text-white' },
  { value: 'preter', label: 'Prêter', icon: Clock, activeClass: 'bg-preter text-white' },
  { value: 'vendre', label: 'Vendre', icon: Euro, activeClass: 'bg-vendre text-white' },
  { value: 'cherche', label: 'Recherche', icon: Search, activeClass: 'bg-cherche text-white' },
];

interface SearchCoordinates {
  latitude: number;
  longitude: number;
  city: string;
}

export function HomePage() {
  usePageTitle();
  const { showToast } = useToast();
  const [listings, setListings] = useState<(ListingWithDetails & { distance_km?: number | null })[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [postalCode, setPostalCode] = useState('');
  const [searchPostalCode, setSearchPostalCode] = useState('');
  const [searchCoords, setSearchCoords] = useState<SearchCoordinates | null>(null);
  const [radiusKm, setRadiusKm] = useState(DEFAULT_RADIUS_KM);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTypes, setSelectedTypes] = useState<Set<ListingType>>(new Set());
  const debouncedPostalCode = useDebounce(postalCode, 400);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const pageRef = useRef(0);

  useEffect(() => {
    fetchCategories();
    fetchListings();
  }, []);

  async function fetchCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      if (data) setCategories(data);
    } catch {
      showToast('Impossible de charger les categories', 'error');
    }
  }

  function buildQuery() {
    let query = supabase
      .from('listings')
      .select(`
        *,
        category:categories(*),
        profile:profiles(*)
      `)
      .eq('status', 'active')
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
      .order('created_at', { ascending: false });

    if (selectedCategory !== 'all') {
      query = query.eq('category_id', selectedCategory);
    }

    if (selectedTypes.size > 0) {
      query = query.in('listing_type', Array.from(selectedTypes));
    }

    return query;
  }

  async function fetchListingsWithDistance() {
    if (!searchCoords) return null;

    const { data, error } = await supabase.rpc('find_listings_within_radius', {
      user_lat: searchCoords.latitude,
      user_lon: searchCoords.longitude,
      radius_km: radiusKm,
    });

    if (error) throw error;
    return data as ListingWithDistance[];
  }

  async function fetchListings() {
    setLoading(true);
    pageRef.current = 0;
    try {
      if (searchCoords) {
        const distanceData = await fetchListingsWithDistance();

        let filteredData = distanceData || [];

        if (selectedCategory !== 'all') {
          filteredData = filteredData.filter(l => l.category_id === selectedCategory);
        }
        if (selectedTypes.size > 0) {
          filteredData = filteredData.filter(l => selectedTypes.has(l.listing_type));
        }

        const listingIds = filteredData.slice(0, PAGE_SIZE).map(l => l.id);
        const distanceMap = new Map(filteredData.map(l => [l.id, l.distance_km]));

        if (listingIds.length > 0) {
          const { data: fullData, error } = await supabase
            .from('listings')
            .select(`
              *,
              category:categories(*),
              profile:profiles(*)
            `)
            .in('id', listingIds);

          if (error) throw error;

          if (fullData) {
            const enrichedData = fullData.map(listing => ({
              ...listing,
              distance_km: distanceMap.get(listing.id) ?? null,
            }));
            enrichedData.sort((a, b) => (a.distance_km ?? 999) - (b.distance_km ?? 999));
            setListings(enrichedData as (ListingWithDetails & { distance_km?: number | null })[]);
            setHasMore(filteredData.length > PAGE_SIZE);
          }
        } else {
          const postalPrefix = searchPostalCode.substring(0, 2);
          let fallbackQuery = supabase
            .from('listings')
            .select(`
              *,
              category:categories(*),
              profile:profiles(*)
            `)
            .eq('status', 'active')
            .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
            .like('postal_code', `${postalPrefix}%`)
            .order('created_at', { ascending: false })
            .range(0, PAGE_SIZE - 1);

          if (selectedCategory !== 'all') {
            fallbackQuery = fallbackQuery.eq('category_id', selectedCategory);
          }
          if (selectedTypes.size > 0) {
            fallbackQuery = fallbackQuery.in('listing_type', Array.from(selectedTypes));
          }

          const { data: fallbackData, error: fallbackError } = await fallbackQuery;

          if (fallbackError) throw fallbackError;

          if (fallbackData && fallbackData.length > 0) {
            setListings(fallbackData as ListingWithDetails[]);
            setHasMore(fallbackData.length === PAGE_SIZE);
          } else {
            setListings([]);
            setHasMore(false);
          }
        }
      } else if (searchPostalCode) {
        const postalPrefix = searchPostalCode.substring(0, 2);
        let query = supabase
          .from('listings')
          .select(`
            *,
            category:categories(*),
            profile:profiles(*)
          `)
          .eq('status', 'active')
          .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
          .like('postal_code', `${postalPrefix}%`)
          .order('created_at', { ascending: false })
          .range(0, PAGE_SIZE - 1);

        if (selectedCategory !== 'all') {
          query = query.eq('category_id', selectedCategory);
        }
        if (selectedTypes.size > 0) {
          query = query.in('listing_type', Array.from(selectedTypes));
        }

        const { data, error } = await query;

        if (error) throw error;

        if (data) {
          setListings(data as ListingWithDetails[]);
          setHasMore(data.length === PAGE_SIZE);
        }
      } else {
        const query = buildQuery().range(0, PAGE_SIZE - 1);
        const { data, error } = await query;

        if (error) throw error;

        if (data) {
          setListings(data as ListingWithDetails[]);
          setHasMore(data.length === PAGE_SIZE);
        }
      }

      if (searchPostalCode || selectedCategory !== 'all' || selectedTypes.size > 0) {
        supabase.from('analytics_events').insert({
          event_type: 'filter_used',
          event_data: {
            postal_code: searchPostalCode ? true : false,
            category: selectedCategory !== 'all',
            types: Array.from(selectedTypes),
            radius_km: searchCoords ? radiusKm : null,
          },
          postal_code_prefix: searchPostalCode?.substring(0, 2) || null,
        });
      }
    } catch {
      showToast('Impossible de charger les annonces', 'error');
    } finally {
      setLoading(false);
    }
  }

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || searchCoords) return;
    setLoadingMore(true);
    pageRef.current += 1;
    const from = pageRef.current * PAGE_SIZE;
    try {
      const query = buildQuery().range(from, from + PAGE_SIZE - 1);
      const { data, error } = await query;
      if (error) throw error;
      if (data) {
        setListings(prev => [...prev, ...(data as ListingWithDetails[])]);
        setHasMore(data.length === PAGE_SIZE);
      }
    } catch {
      showToast('Impossible de charger plus d\'annonces', 'error');
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, searchCoords, selectedCategory, selectedTypes]);

  async function handleGeocodeAndSearch(code: string) {
    if (code.length !== 5) {
      setSearchCoords(null);
      setSearchPostalCode(code);
      return;
    }

    setGeocoding(true);
    try {
      const result = await geocodePostalCode(code);
      if (result) {
        setSearchCoords({
          latitude: result.latitude,
          longitude: result.longitude,
          city: result.city,
        });
        setSearchPostalCode(code);
      } else {
        setSearchCoords(null);
        setSearchPostalCode(code);
      }
    } catch {
      setSearchCoords(null);
      setSearchPostalCode(code);
    } finally {
      setGeocoding(false);
    }
  }

  useEffect(() => {
    if (debouncedPostalCode.length === 5) {
      handleGeocodeAndSearch(debouncedPostalCode);
    } else if (debouncedPostalCode.length === 0 && searchPostalCode) {
      setSearchPostalCode('');
      setSearchCoords(null);
    }
  }, [debouncedPostalCode]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (postalCode.length === 5) {
      handleGeocodeAndSearch(postalCode);
    } else {
      setSearchPostalCode(postalCode);
      setSearchCoords(null);
    }
  }

  function toggleType(type: ListingType) {
    setSelectedTypes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  }

  function clearAllFilters() {
    setSelectedCategory('all');
    setSelectedTypes(new Set());
    setSearchPostalCode('');
    setSearchCoords(null);
    setPostalCode('');
    setRadiusKm(DEFAULT_RADIUS_KM);
  }

  function expandSearchRadius() {
    const currentIndex = RADIUS_OPTIONS.findIndex(r => r.value === radiusKm);
    if (currentIndex < RADIUS_OPTIONS.length - 1) {
      setRadiusKm(RADIUS_OPTIONS[currentIndex + 1].value);
    }
  }

  useEffect(() => {
    fetchListings();
  }, [searchPostalCode, searchCoords, radiusKm, selectedCategory, selectedTypes]);

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    selectedTypes.size +
    (searchCoords ? 1 : 0);

  const canExpandRadius = searchCoords && radiusKm < RADIUS_OPTIONS[RADIUS_OPTIONS.length - 1].value;

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col">
      <header className="relative text-white px-4 pt-10 pb-20 overflow-hidden min-h-[240px]">
        <img
          src="/hero-voisinage.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-110"
          style={{ objectPosition: '50% 55%', filter: 'saturate(1.15) brightness(1.05) blur(0.5px)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/55 via-stone-900/35 to-stone-900/75" />

        <div className="relative flex flex-col items-center text-center mb-8">
          <div className="w-[4.5rem] h-[4.5rem] rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-xl shadow-black/25 mb-5 ring-2 ring-sun/40">
            <Logo size={44} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2" style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 2px 12px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.4)', color: '#fff3e0' }}>Voisinage</h1>
          <p className="text-sm font-semibold tracking-wider uppercase text-white bg-stone-900/50 backdrop-blur-md px-5 py-2 rounded-full border border-white/15 shadow-lg shadow-black/10" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>L'entraide entre voisins</p>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <div className="flex items-stretch bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg shadow-black/15 ring-1 ring-white/20">
            <div className="flex items-center flex-1 px-4">
              <MapPin className="text-stone-400 flex-shrink-0" size={20} />
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder="Votre code postal"
                className="flex-1 ml-3 py-4 text-stone-800 placeholder:text-stone-400 bg-transparent outline-none text-base font-medium"
                maxLength={5}
                inputMode="numeric"
              />
              {geocoding && (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-sun border-t-transparent mr-2" />
              )}
            </div>
            <button
              type="submit"
              className="bg-sun hover:bg-sun-dark text-white px-6 flex items-center justify-center transition-colors"
            >
              <Search size={20} />
            </button>
          </div>
          {searchCoords && (
            <div className="flex items-center justify-center gap-2 mt-3">
              <Navigation size={14} className="text-white/80" />
              <span className="text-white/90 text-sm">Rayon :</span>
              <div className="flex gap-1">
                {RADIUS_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRadiusKm(option.value)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      radiusKm === option.value
                        ? 'bg-white text-stone-800'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>
      </header>

      <div className="relative -mt-10 bg-cream-50 rounded-t-[2rem] flex-1 pb-24">
        <div className="px-4 pt-6 pb-4">
        <div className="mb-3 overflow-x-auto pb-2 -mx-4 px-4">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-primary-600 text-white'
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
                      ? 'bg-primary-600 text-white'
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

        <div className="flex gap-2 mb-3 overflow-x-auto pb-1 -mx-4 px-4">
          {TYPE_OPTIONS.map(option => {
            const Icon = option.icon;
            const isSelected = selectedTypes.has(option.value as ListingType);
            return (
              <button
                key={option.value}
                onClick={() => toggleType(option.value as ListingType)}
                className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  isSelected
                    ? option.activeClass
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
                }`}
              >
                <Icon size={16} />
                {option.label}
              </button>
            );
          })}
        </div>

        {activeFilterCount > 0 && (
          <div className="flex items-center justify-between mb-3 bg-stone-50 rounded-xl px-4 py-3">
            <span className="text-sm text-stone-600">
              {activeFilterCount} filtre{activeFilterCount > 1 ? 's' : ''} actif{activeFilterCount > 1 ? 's' : ''}
            </span>
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 text-sm text-primary-600 font-medium hover:text-primary-700"
            >
              <X size={16} />
              Effacer tout
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-stone-800">
            {searchCoords
              ? `À ${radiusKm} km de ${searchCoords.city}`
              : 'Dernières annonces'}
          </h2>
          <span className="text-sm text-stone-500">
            {listings.length} résultat{listings.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {categories.length === 0 && <SkeletonFilterBar />}
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : listings.length === 0 ? (
          <div className="space-y-4">
            <EmptyState
              icon={Leaf}
              title="Aucune annonce trouvée"
              description={
                searchCoords && canExpandRadius
                  ? `Pas d'annonces dans un rayon de ${radiusKm} km`
                  : activeFilterCount > 0
                  ? 'Essayez de modifier vos filtres'
                  : 'Soyez le premier à proposer quelque chose !'
              }
              actionLabel={
                searchCoords && canExpandRadius
                  ? 'Élargir la recherche'
                  : activeFilterCount > 0
                  ? 'Effacer les filtres'
                  : 'Créer une annonce'
              }
              actionTo={activeFilterCount > 0 || (searchCoords && canExpandRadius) ? undefined : '/creer'}
              onAction={
                searchCoords && canExpandRadius
                  ? expandSearchRadius
                  : activeFilterCount > 0
                  ? clearAllFilters
                  : undefined
              }
            />
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map((listing, index) => (
              <div
                key={listing.id}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ListingCard listing={listing} distanceKm={listing.distance_km} />
              </div>
            ))}
            {hasMore && (
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="w-full py-3 flex items-center justify-center gap-2 text-primary-600 font-medium bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors disabled:opacity-50"
              >
                {loadingMore ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-600 border-t-transparent" />
                ) : (
                  <>
                    <ChevronDown size={20} />
                    Voir plus d'annonces
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

        <HomePageFooter />
      </div>
    </div>
  );
}
