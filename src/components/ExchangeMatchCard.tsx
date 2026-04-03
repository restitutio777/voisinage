import { Link } from 'react-router-dom';
import { ArrowLeftRight, MapPin, ShoppingBasket, Wrench, HeartHandshake, Shirt, Package, Leaf, User, CheckCircle, MessageCircle } from 'lucide-react';
import type { ExchangeMatchWithDetails } from '../lib/database.types';

const categoryIcons: Record<string, typeof ShoppingBasket> = {
  'shopping-basket': ShoppingBasket,
  'wrench': Wrench,
  'heart-handshake': HeartHandshake,
  'shirt': Shirt,
  'package': Package,
};

interface ExchangeMatchCardProps {
  match: ExchangeMatchWithDetails;
  currentUserId: string;
  onContact: () => void;
}

export function ExchangeMatchCard({ match, currentUserId, onContact }: ExchangeMatchCardProps) {
  const myWish = match.wish_a.user_id === currentUserId ? match.wish_a : match.wish_b;
  const theirWish = match.wish_a.user_id === currentUserId ? match.wish_b : match.wish_a;

  const MyOfferIcon = categoryIcons[myWish.offer_category?.icon] || Leaf;
  const TheirOfferIcon = categoryIcons[theirWish.offer_category?.icon] || Leaf;

  return (
    <div className="card overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 relative">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-echanger" />
      <div className="bg-echanger-light px-4 py-2">
        <div className="flex items-center justify-center gap-2 text-echanger-dark font-medium">
          <ArrowLeftRight size={20} />
          <span>Echange possible !</span>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <p className="text-xs text-stone-500 uppercase tracking-wide mb-2">Vous offrez</p>
            <div className="bg-echanger-light p-3 rounded-xl inline-block mb-2">
              <MyOfferIcon size={28} className="text-echanger" />
            </div>
            <p className="font-medium text-stone-900 text-sm">{myWish.offer_description}</p>
          </div>

          <div className="text-center">
            <p className="text-xs text-stone-500 uppercase tracking-wide mb-2">Vous recevez</p>
            <div className="bg-primary-100 p-3 rounded-xl inline-block mb-2">
              <TheirOfferIcon size={28} className="text-primary-600" />
            </div>
            <p className="font-medium text-stone-900 text-sm">{theirWish.offer_description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <Link
            to={`/voisin/${theirWish.user_id}`}
            className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-800"
          >
            {theirWish.profile?.avatar_url ? (
              <img
                src={theirWish.profile.avatar_url}
                alt={theirWish.profile.username || 'Voisin'}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center">
                <User size={16} className="text-stone-500" />
              </div>
            )}
            <div>
              <p className="font-medium flex items-center gap-1">
                {theirWish.profile?.username || 'Voisin'}
                {theirWish.profile?.is_verified && (
                  <CheckCircle size={14} className="text-primary-600" />
                )}
              </p>
              <p className="text-xs text-stone-500 flex items-center gap-1">
                <MapPin size={12} />
                {theirWish.city || theirWish.postal_code}
              </p>
            </div>
          </Link>

          <button
            onClick={onContact}
            className="btn-echanger py-2 px-4 text-sm flex items-center gap-2"
          >
            <MessageCircle size={16} />
            Contacter
          </button>
        </div>
      </div>
    </div>
  );
}
