import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, ShoppingBasket, Wrench, HeartHandshake, Shirt, Package, Leaf, User, CheckCircle } from 'lucide-react';
import type { ExchangeWishWithDetails } from '../lib/database.types';

const categoryIcons: Record<string, typeof ShoppingBasket> = {
  'shopping-basket': ShoppingBasket,
  'wrench': Wrench,
  'heart-handshake': HeartHandshake,
  'shirt': Shirt,
  'package': Package,
};

interface ExchangeWishCardProps {
  wish: ExchangeWishWithDetails;
  showProfile?: boolean;
  onContact?: () => void;
}

export function ExchangeWishCard({ wish, showProfile = true, onContact }: ExchangeWishCardProps) {
  const OfferIcon = categoryIcons[wish.offer_category?.icon] || Leaf;
  const SeekIcon = categoryIcons[wish.seek_category?.icon] || Leaf;

  const createdDate = new Date(wish.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className="card p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-echanger" />
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 flex items-center gap-3">
          <div className="bg-echanger-light p-3 rounded-xl">
            <OfferIcon size={24} className="text-echanger" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-stone-500 uppercase tracking-wide">J'offre</p>
            <p className="font-medium text-stone-900 truncate">{wish.offer_description}</p>
            <p className="text-sm text-stone-500">{wish.offer_category?.name}</p>
          </div>
        </div>

        <ArrowRight size={24} className="text-stone-400 flex-shrink-0" />

        <div className="flex-1 flex items-center gap-3">
          <div className="bg-primary-100 p-3 rounded-xl">
            <SeekIcon size={24} className="text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-stone-500 uppercase tracking-wide">Je cherche</p>
            <p className="font-medium text-stone-900 truncate">{wish.seek_description}</p>
            <p className="text-sm text-stone-500">{wish.seek_category?.name}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-stone-100">
        <div className="flex items-center gap-4 text-sm text-stone-500">
          <div className="flex items-center gap-1">
            <MapPin size={16} />
            <span>{wish.city || wish.postal_code}</span>
          </div>
          <span>{createdDate}</span>
        </div>

        {showProfile && wish.profile && (
          <Link
            to={`/voisin/${wish.user_id}`}
            className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-800"
          >
            {wish.profile.avatar_url ? (
              <img
                src={wish.profile.avatar_url}
                alt={wish.profile.username || 'Voisin'}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center">
                <User size={14} className="text-stone-500" />
              </div>
            )}
            <span className="font-medium">{wish.profile.username || 'Voisin'}</span>
            {wish.profile.is_verified && (
              <CheckCircle size={14} className="text-primary-600" />
            )}
          </Link>
        )}

        {onContact && (
          <button
            onClick={onContact}
            className="btn-primary py-2 px-4 text-sm"
          >
            Contacter
          </button>
        )}
      </div>
    </div>
  );
}
