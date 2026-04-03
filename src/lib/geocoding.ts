export interface GeocodingResult {
  latitude: number;
  longitude: number;
  city: string;
  postalCode: string;
}

interface ApiAddressFeature {
  geometry: {
    coordinates: [number, number];
  };
  properties: {
    city: string;
    postcode: string;
    label: string;
  };
}

interface ApiAddressResponse {
  features: ApiAddressFeature[];
}

const geocodingCache = new Map<string, GeocodingResult>();

export async function geocodePostalCode(postalCode: string): Promise<GeocodingResult | null> {
  const cleanPostalCode = postalCode.trim();

  if (!/^\d{5}$/.test(cleanPostalCode)) {
    return null;
  }

  if (geocodingCache.has(cleanPostalCode)) {
    return geocodingCache.get(cleanPostalCode)!;
  }

  try {
    const response = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${cleanPostalCode}&type=municipality&postcode=${cleanPostalCode}&limit=1`
    );

    if (!response.ok) {
      return null;
    }

    const data: ApiAddressResponse = await response.json();

    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      const result: GeocodingResult = {
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        city: feature.properties.city,
        postalCode: feature.properties.postcode,
      };

      geocodingCache.set(cleanPostalCode, result);
      return result;
    }

    return null;
  } catch {
    return null;
  }
}

export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return '< 1 km';
  }
  return `${Math.round(distanceKm)} km`;
}
