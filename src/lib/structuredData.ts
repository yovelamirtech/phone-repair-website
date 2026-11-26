import { siteUrl } from '../config/site';
import { business } from '../data/business';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

/** LocalBusiness JSON-LD for Google, built from src/data/business.ts. */
export function buildLocalBusiness() {
  const openingHoursSpecification = Object.entries(business.hours).flatMap(([day, ranges]) =>
    ranges.map((r) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${dayNames[Number(day)]}`,
      opens: r.open,
      closes: r.close,
    })),
  );
  return {
    '@context': 'https://schema.org',
    '@type': 'MobilePhoneStore',
    '@id': `${siteUrl}#business`,
    name: business.name.he,
    alternateName: business.name.en,
    url: siteUrl,
    image: `${siteUrl}og-image.png`,
    logo: `${siteUrl}images/logo.svg`,
    telephone: business.phoneE164,
    email: business.email,
    priceRange: '₪₪',
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.street.he,
      addressLocality: business.address.city.he,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: business.geo.lat, longitude: business.geo.lng },
    openingHoursSpecification,
  };
}
