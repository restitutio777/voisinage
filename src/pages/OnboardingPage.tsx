import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, RefreshCw, Euro, MapPin, ChevronRight, ChevronLeft, Clock, Search } from 'lucide-react';
import { usePageTitle } from '../lib/usePageTitle';
import { Logo } from '../components/Logo';

const slides = [
  {
    id: 'welcome',
    icon: Gift,
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-600',
    title: 'Tout coûte plus cher. Vos voisins peuvent aider.',
    description:
      'Inflation, isolement, surconsommation — la réponse est locale. Voisinage connecte les habitants d\'un même quartier pour s\'entraider concrètement.',
    image: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=600&h=400&fit=crop',
  },
  {
    id: 'actions',
    icon: Gift,
    iconBg: 'bg-donner-light',
    iconColor: 'text-donner-dark',
    title: 'Donnez, Échangez, Prêtez, Vendez',
    description:
      'Cinq actions concrètes. Offrez ce qui dort chez vous, troquez un service, prêtez vos outils, vendez à prix juste ou cherchez ce qu\'il vous faut — sans intermédiaire.',
    badges: [
      { label: 'Donner', icon: Gift, bg: 'bg-donner', text: 'text-white' },
      { label: 'Échanger', icon: RefreshCw, bg: 'bg-echanger', text: 'text-white' },
      { label: 'Prêter', icon: Clock, bg: 'bg-preter', text: 'text-white' },
      { label: 'Vendre', icon: Euro, bg: 'bg-vendre', text: 'text-white' },
      { label: 'Recherche', icon: Search, bg: 'bg-cherche', text: 'text-white' },
    ],
  },
  {
    id: 'local',
    icon: MapPin,
    iconBg: 'bg-sun-light/30',
    iconColor: 'text-sun-dark',
    title: 'Votre quartier, votre réseau',
    description:
      'Recherchez par code postal. Découvrez ce que vos voisins proposent. Tout se passe à côté de chez vous — pas de livraison, pas d\'intermédiaire.',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop',
  },
];

export function OnboardingPage() {
  usePageTitle('Découvrir');
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const slide = slides[current];
  const isLast = current === slides.length - 1;

  function next() {
    if (isLast) {
      navigate('/inscription');
    } else {
      setCurrent(current + 1);
    }
  }

  function prev() {
    if (current > 0) {
      setCurrent(current - 1);
    }
  }

  function skip() {
    navigate('/inscription');
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Logo size={28} />
          <span className="text-lg font-bold text-stone-800" style={{ fontFamily: "'Nunito', sans-serif", letterSpacing: '0.02em' }}>Voisinage</span>
        </div>
        {!isLast && (
          <button
            onClick={skip}
            className="text-sm font-medium text-stone-500 hover:text-stone-700 px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors"
          >
            Passer
          </button>
        )}
      </header>

      <div className="flex-1 flex flex-col px-4 pt-4 pb-6 overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div
            key={slide.id}
            className="animate-fade-in w-full max-w-sm mx-auto flex flex-col items-center"
          >
            {slide.image && (
              <div className="w-full aspect-[3/2] rounded-2xl overflow-hidden mb-8 shadow-lg shadow-stone-200/60">
                <img
                  src={slide.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {!slide.image && (
              <div className={`w-20 h-20 rounded-2xl ${slide.iconBg} flex items-center justify-center mb-8`}>
                <slide.icon size={40} className={slide.iconColor} />
              </div>
            )}

            <h2 className="text-2xl font-bold text-stone-900 mb-3 leading-tight">
              {slide.title}
            </h2>

            <p className="text-stone-600 text-base leading-relaxed mb-6 max-w-xs">
              {slide.description}
            </p>

            {slide.badges && (
              <div className="flex gap-3 justify-center">
                {slide.badges.map((badge) => {
                  const BadgeIcon = badge.icon;
                  return (
                    <div
                      key={badge.label}
                      className={`${badge.bg} ${badge.text} flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm`}
                    >
                      <BadgeIcon size={18} />
                      {badge.label}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto pt-6 space-y-4">
          <div className="flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? 'w-8 bg-primary-600'
                    : 'w-2 bg-stone-200 hover:bg-stone-300'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            {current > 0 && (
              <button
                onClick={prev}
                className="flex items-center justify-center w-14 h-14 rounded-xl border-2 border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors shrink-0"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            <button
              onClick={next}
              className="btn-primary flex-1 text-lg gap-2"
            >
              {isLast ? 'Créer mon compte' : 'Suivant'}
              {!isLast && <ChevronRight size={20} />}
            </button>
          </div>

          {isLast && (
            <button
              onClick={() => navigate('/connexion')}
              className="w-full text-center text-base font-medium text-primary-600 hover:text-primary-700 py-2"
            >
              J'ai déjà un compte
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
