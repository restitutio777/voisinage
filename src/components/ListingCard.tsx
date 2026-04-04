import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShoppingBasket, Wrench, HeartHandshake, Shirt, Package, Leaf, Navigation } from 'lucide-react';
import type { ListingWithDetails } from '../lib/database.types';
import { formatDistance } from '../lib/geocoding';

interface ListingCardProps {
  listing: ListingWithDetails;
  distanceKm?: number | null;
}

const categoryIcons: Record<string, typeof ShoppingBasket> = {
  'shopping-basket': ShoppingBasket,
  'wrench': Wrench,
  'heart-handshake': HeartHandshake,
  'shirt': Shirt,
  'package': Package,
};

const typeLabels: Record<string, string> = {
  donner: 'À donner',
  echanger: 'À échanger',
  vendre: 'À vendre',
  preter: 'À prêter',
  cherche: 'Recherche',
};

const typeStyles: Record<string, string> = {
  donner: 'badge-donner',
  echanger: 'badge-echanger',
  vendre: 'badge-vendre',
  preter: 'badge-preter',
  cherche: 'badge-cherche',
};

const accentColors: Record<string, string> = {
  donner: 'bg-donner',
  echanger: 'bg-echanger',
  vendre: 'bg-vendre',
  preter: 'bg-preter',
  cherche: 'bg-cherche',
};

export function ListingCard({ listing, distanceKm }: ListingCardProps) {
  const Icon = categoryIcons[listing.category?.icon] || Leaf;
  const displayLocation = listing.city || listing.postal_code;
  const [imgError, setImgError] = useState(false);

  return (
    <Link to={`/annonce/${listing.id}`} className="block group">
      <article className="bg-white rounded-2xl border border-stone-200 hover:border-stone-300 hover:shadow-md transition-all duration-200 overflow-hidden">
        <div className="flex">
          {listing.image_url && !imgError ? (
            <div className="w-28 h-28 flex-shrink-0 m-3 rounded-xl overflow-hidden">
              <img
                src={listing.image_url}
                alt={listing.title}
                loading="lazy"
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            </div>
          ) : (
            <div className="w-28 h-28 flex-shrink-0 m-3 rounded-xl bg-stone-50 flex items-center justify-center">
              <Icon size={32} className="text-stone-300" />
            </div>
          )}

          <div className="flex-1 py-3 pr-4">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="text-base font-semibold text-stone-900 line-clamp-1">
                {listing.title}
              </h3>
              <span className={`${typeStyles[listing.listing_type]} text-xs`}>
                {typeLabels[listing.listing_type]}
              </span>
            </div>

            {listing.quantity && (
              <p className="text-sm text-stone-500 mb-1">{listing.quantity}</p>
            )}

            {listing.listing_type === 'vendre' && listing.price && (
              <p className="text-lg font-bold text-vendre mb-1">
                {listing.price.toFixed(2)} €
              </p>
            )}

            <div className="flex items-center gap-3 text-stone-400 text-xs mt-auto">
              <span className="flex items-center">
                <MapPin size={13} className="mr-1" />
                {displayLocation}
              </span>
              {distanceKm != null && (
                <span className="flex items-center text-primary-600 font-medium">
                  <Navigation size={13} className="mr-1" />
                  {formatDistance(distanceKm)}
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
