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
      <article className="card hover:shadow-lg hover:-translate-y-1 transition-all duration-200 relative overflow-hidden">
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentColors[listing.listing_type]}`} />
        <div className="flex">
          {listing.image_url && !imgError ? (
            <div className="w-32 h-32 flex-shrink-0">
              <img
                src={listing.image_url}
                alt={listing.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImgError(true)}
              />
            </div>
          ) : (
            <div className="w-32 h-32 flex-shrink-0 bg-stone-100 flex items-center justify-center">
              <Icon size={40} className="text-stone-400" />
            </div>
          )}

          <div className="flex-1 p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-lg font-semibold text-stone-900 line-clamp-1">
                {listing.title}
              </h3>
              <span className={typeStyles[listing.listing_type]}>
                {typeLabels[listing.listing_type]}
              </span>
            </div>

            {listing.quantity && (
              <p className="text-stone-600 mb-2">{listing.quantity}</p>
            )}

            {listing.listing_type === 'vendre' && listing.price && (
              <p className="text-xl font-bold text-vendre mb-2">
                {listing.price.toFixed(2)} €
              </p>
            )}

            <div className="flex items-center gap-3 text-stone-500 text-sm">
              <span className="flex items-center">
                <MapPin size={16} className="mr-1" />
                {displayLocation}
              </span>
              {distanceKm != null && (
                <span className="flex items-center text-primary-600 font-medium">
                  <Navigation size={14} className="mr-1" />
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
