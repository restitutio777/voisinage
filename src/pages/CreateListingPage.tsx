import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Camera, Image, ShoppingBasket, Wrench, HeartHandshake, Shirt, Package, Gift, RefreshCw, Euro, Clock, Search as SearchIcon, CheckCircle, AlertTriangle, Info, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { usePageMeta } from '../lib/usePageMeta';
import { geocodePostalCode } from '../lib/geocoding';
import type { Category, ListingType, QuantityThreshold } from '../lib/database.types';

const categoryIcons: Record<string, typeof ShoppingBasket> = {
  'shopping-basket': ShoppingBasket,
  'wrench': Wrench,
  'heart-handshake': HeartHandshake,
  'shirt': Shirt,
  'package': Package,
};

const listingTypes: { value: ListingType; label: string; description: string; icon: typeof Gift; color: string; activeClass: string; activeBg: string }[] = [
  { value: 'donner', label: 'Donner', description: 'Je donne gratuitement', icon: Gift, color: 'donner', activeClass: 'border-donner bg-donner-light', activeBg: 'bg-donner text-white' },
  { value: 'echanger', label: 'Échanger', description: 'Je souhaite échanger', icon: RefreshCw, color: 'echanger', activeClass: 'border-echanger bg-echanger-light', activeBg: 'bg-echanger text-white' },
  { value: 'preter', label: 'Prêter', description: 'Je prête temporairement', icon: Clock, color: 'preter', activeClass: 'border-preter bg-preter-light', activeBg: 'bg-preter text-white' },
  { value: 'vendre', label: 'Vendre', description: 'Je vends à petit prix', icon: Euro, color: 'vendre', activeClass: 'border-vendre bg-vendre-light', activeBg: 'bg-vendre text-white' },
  { value: 'cherche', label: 'Recherche', description: 'Je cherche quelque chose', icon: SearchIcon, color: 'cherche', activeClass: 'border-cherche bg-cherche-light', activeBg: 'bg-cherche text-white' },
];


export function CreateListingPage() {
  usePageMeta({
    title: 'Publier une annonce gratuite entre voisins | Voisinage.app',
    description: "Créez une annonce en 30 secondes. Donnez, prêtez, échangez ou vendez un objet ou un service à vos voisins. Gratuit, local, sans intermédiaire.",
    canonical: 'https://voisinage.app/creer',
  });
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [_thresholds, _setThresholds] = useState<QuantityThreshold[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [listingType, setListingType] = useState<ListingType>('donner');
  const [price, setPrice] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (user) fetchData();
  }, [user, navigate]);

  async function fetchData() {
    try {
      const [categoriesResult, thresholdsResult] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('quantity_thresholds').select('*'),
      ]);

      if (categoriesResult.error) throw categoriesResult.error;
      if (thresholdsResult.error) throw thresholdsResult.error;

      if (categoriesResult.data) setCategories(categoriesResult.data);
      if (thresholdsResult.data) setThresholds(thresholdsResult.data);
    } catch {
      showToast('Impossible de charger les données', 'error');
    }
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 12 * 1024 * 1024) {
        showToast('L\'image ne doit pas dépasser 12 Mo', 'error');
        return;
      }
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  }

  const selectedCategory = useMemo(() =>
    categories.find(c => c.id === categoryId),
    [categories, categoryId]
  );


  async function handleSubmit() {
    if (!user || !profile) return;

    setLoading(true);

    try {
      let finalImageUrl = '';

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('listing-images')
          .upload(fileName, imageFile);

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('listing-images')
            .getPublicUrl(fileName);
          finalImageUrl = publicUrl;
        }
      }

      let latitude: number | null = null;
      let longitude: number | null = null;
      let city = profile.city || null;

      if (profile.postal_code) {
        const geoResult = await geocodePostalCode(profile.postal_code);
        if (geoResult) {
          latitude = geoResult.latitude;
          longitude = geoResult.longitude;
          if (!city) {
            city = geoResult.city;
          }
        }
      }

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 14);

      const { error } = await supabase.from('listings').insert({
        user_id: user.id,
        category_id: categoryId,
        title,
        description: description || null,
        quantity: quantity || null,
        listing_type: listingType,
        price: listingType === 'vendre' && price ? parseFloat(price) : null,
        image_url: finalImageUrl || null,
        postal_code: profile.postal_code || '',
        city,
        latitude,
        longitude,
        is_private_garden_confirmed: confirmed,
        expires_at: expiresAt.toISOString(),
      });

      if (error) throw error;

      await supabase.from('analytics_events').insert({
        event_type: 'listing_created',
        event_data: {
          category: selectedCategory?.name,
          listing_type: listingType,
          has_image: !!finalImageUrl,
        },
        postal_code_prefix: profile.postal_code?.substring(0, 2) || null,
      });

      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch {
      showToast('Impossible de publier l\'annonce', 'error');
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 bg-gradient-to-r from-primary-50 to-cream-100 border-b border-stone-200 px-4 py-3 z-10 shadow-sm">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-stone-600 hover:text-stone-800">
            <ArrowLeft size={24} /><span className="text-lg">Retour</span>
          </button>
        </header>
        <div className="px-4 py-16 text-center">
          <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift size={40} className="text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-3">Proposez à vos voisins</h2>
          <p className="text-stone-600 mb-8 max-w-sm mx-auto">Créez un compte gratuit pour publier votre annonce et aider vos voisins.</p>
          <div className="space-y-3 max-w-xs mx-auto">
            <Link to="/inscription" state={{ from: '/creer' }} className="btn-primary w-full">Créer un compte</Link>
            <Link to="/connexion" state={{ from: '/creer' }} className="btn-secondary w-full">Se connecter</Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">
            Annonce publiée !
          </h2>
          <p className="text-lg text-stone-600">
            Votre annonce est maintenant visible par vos voisins.
          </p>
        </div>
      </div>
    );
  }

  const canProceed = () => {
    switch (step) {
      case 1: return true;
      case 2: return categoryId && title.trim();
      case 3: return listingType && (listingType !== 'vendre' || price);
      case 4: return confirmed;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-gradient-to-r from-primary-50 to-cream-100 border-b border-stone-200 px-4 py-3 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-800"
          >
            <ArrowLeft size={24} />
            <span className="text-lg">Retour</span>
          </button>
          <span className="text-stone-500">Étape {step}/4</span>
        </div>
      </header>

      <div className="flex justify-center gap-2 px-4 py-4">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`flex-1 h-2 rounded-full ${
              s <= step ? 'bg-primary-600' : 'bg-stone-200'
            }`}
          />
        ))}
      </div>

      <div className="px-4 py-4">
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-stone-900 mb-2 text-center">
              Ajoutez une photo
            </h2>
            <p className="text-stone-600 text-center mb-6">
              Une photo aide vos voisins a voir ce que vous proposez
            </p>

            {imageUrl ? (
              <div className="relative mb-6">
                <img
                  src={imageUrl}
                  alt="Apercu"
                  className="w-full aspect-video object-cover rounded-2xl"
                />
                <button
                  onClick={() => { setImageUrl(''); setImageFile(null); }}
                  className="absolute top-4 right-4 bg-white/90 text-stone-700 px-4 py-2 rounded-xl font-medium"
                >
                  Changer
                </button>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center gap-3 bg-primary-600 text-white py-5 rounded-xl cursor-pointer hover:bg-primary-700 transition-colors">
                    <Camera size={28} />
                    <span className="text-xl font-medium">Prendre une photo</span>
                  </div>
                </label>

                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center gap-3 bg-white text-stone-700 border-2 border-stone-300 py-5 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors">
                    <Image size={28} />
                    <span className="text-xl font-medium">Choisir dans la galerie</span>
                  </div>
                </label>
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              className="btn-secondary w-full text-xl"
            >
              {imageUrl ? 'Continuer' : 'Continuer sans photo'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-stone-900 mb-2 text-center">
              Que proposez-vous ?
            </h2>
            <p className="text-stone-600 text-center mb-6">
              Choisissez une catégorie et décrivez votre produit
            </p>

            <div className="mb-6">
              <label className="label">Catégorie</label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => {
                  const Icon = categoryIcons[cat.icon] || Leaf;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoryId(cat.id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
                        categoryId === cat.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <Icon size={28} className={categoryId === cat.id ? 'text-primary-600' : 'text-stone-500'} />
                      <span className={`text-lg font-medium ${categoryId === cat.id ? 'text-primary-700' : 'text-stone-700'}`}>
                        {cat.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="title" className="label">
                Titre de l'annonce
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
                placeholder="Ex: Perceuse Bosch, Cours de cuisine..."
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="quantity" className="label">
                Quantité (optionnel)
              </label>
              <input
                id="quantity"
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="input"
                placeholder="Ex: 1 unité, 2 heures, lot de 5..."
              />
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="label">
                Description (optionnel)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input min-h-[120px]"
                placeholder="Décrivez ce que vous proposez..."
              />
            </div>

            <button
              onClick={() => setStep(3)}
              disabled={!canProceed()}
              className="btn-primary w-full text-xl"
            >
              Continuer
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-stone-900 mb-2 text-center">
              Comment souhaitez-vous partager ?
            </h2>
            <p className="text-stone-600 text-center mb-6">
              Choisissez le type de votre annonce
            </p>

            <div className="space-y-4 mb-6">
              {listingTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = listingType === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setListingType(type.value)}
                    className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-colors ${
                      isSelected ? type.activeClass : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${
                      isSelected ? type.activeBg : 'bg-stone-100 text-stone-500'
                    }`}>
                      <Icon size={28} />
                    </div>
                    <div className="text-left">
                      <p className={`text-xl font-semibold ${isSelected ? '' : 'text-stone-800'}`}>
                        {type.label}
                      </p>
                      <p className="text-stone-600">{type.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {listingType === 'vendre' && (
              <div className="mb-6">
                <label htmlFor="price" className="label">
                  Prix (en euros)
                </label>
                <div className="relative">
                  <input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="input pr-16"
                    placeholder="0.00"
                    min="0"
                    step="0.50"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 text-lg">
                    €
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={() => setStep(4)}
              disabled={!canProceed()}
              className="btn-primary w-full text-xl"
            >
              Continuer
            </button>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold text-stone-900 mb-2 text-center">
              Vérification
            </h2>
            <p className="text-stone-600 text-center mb-6">
              Vérifiez votre annonce avant de la publier
            </p>

            <div className="card mb-6">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full aspect-video object-cover"
                />
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-xl font-semibold text-stone-900">{title}</h3>
                  <span className={`badge badge-${listingType}`}>
                    {listingTypes.find(t => t.value === listingType)?.label}
                  </span>
                </div>
                {quantity && <p className="text-stone-600 mb-2">{quantity}</p>}
                {listingType === 'vendre' && price && (
                  <p className="text-xl font-bold text-vendre">{parseFloat(price).toFixed(2)} €</p>
                )}
              </div>
            </div>

            <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-4 mb-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="w-6 h-6 mt-1 rounded border-stone-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-primary-800">
                  Je confirme que cette annonce est conforme aux conditions d'utilisation de Voisinage et que je suis un particulier.
                </span>
              </label>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!canProceed() || loading}
              className="btn-primary w-full text-xl"
            >
              {loading ? (
                <span className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></span>
              ) : (
                'Publier mon annonce'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
