import { MapPin, Navigation, Car, Train, Plane, Compass } from 'lucide-react';
import { SiteSettings } from '../types';
import { SEOHead } from '../components/SEOHead';

interface LocationPageProps {
  siteSettings: SiteSettings;
}

export function LocationPage({ siteSettings }: LocationPageProps) {
  const openGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteSettings.locationAddress)}`,
      '_blank'
    );
  };

  const nearbyAttractions = [
    {
      name: 'Nearby Hill Fort',
      distance: '15 mins drive',
      description: 'A popular hill fort offering panoramic views of the surrounding valleys.',
    },
    {
      name: 'Lake Side Viewpoint',
      distance: '10 mins drive',
      description: 'Perfect for sunset photography and short treks.',
    },
    {
      name: 'Historical Ruins',
      distance: '30 mins drive',
      description: 'Ancient ruins providing a glimpse into local heritage.',
    },
    {
      name: 'Adventure Park',
      distance: '45 mins drive',
      description: 'Local adventure sports and activities hub.',
    },
  ];

  const bgColor = siteSettings.themeColors.background;
  const textColor = siteSettings.themeColors.text;
  const accentColor = siteSettings.themeColors.primary;
  const cardBg = siteSettings.themeColors.cardBg;
  const textMuted = siteSettings.themeColors.textMuted;
  const borderCol = siteSettings.themeColors.border;
  const radius = siteSettings.themeBorderRadius === 'none' ? '0' : siteSettings.themeBorderRadius === 'sm' ? '0.125rem' : siteSettings.themeBorderRadius === 'md' ? '0.375rem' : siteSettings.themeBorderRadius === 'lg' ? '0.5rem' : siteSettings.themeBorderRadius === 'xl' ? '0.75rem' : '1rem';

  return (
    <div style={{ backgroundColor: bgColor, minHeight: '100vh', paddingBottom: '6rem' }}>
      <SEOHead
        title={`Location & How to Reach | ${siteSettings.businessName}`}
        description={`Directions to ${siteSettings.businessName}.`}
      />

      <div style={{ backgroundColor: cardBg, color: textColor, borderBottom: `1px solid ${borderCol}` }} className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <span style={{ color: accentColor }} className="text-xs font-bold uppercase tracking-widest block mb-2">
            Location
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">
            How to Reach Us
          </h1>
          <p style={{ color: textMuted }} className="text-sm sm:text-base max-w-2xl mx-auto mt-3">
            Easily accessible via smooth roads from major cities nearby.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-12">
        {/* Map Embed + Address Box */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          <div style={{ borderColor: borderCol, borderRadius: radius }} className="lg:col-span-2 bg-stone-100 overflow-hidden border shadow-md aspect-[16/9] lg:aspect-auto">
            {siteSettings.googleMapsEmbedUrl ? (
              <iframe
                src={siteSettings.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '380px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${siteSettings.businessName} Map Location`}
              />
            ) : (
              <div className="w-full h-full min-h-[380px] flex items-center justify-center bg-stone-200">
                <p className="text-stone-500 font-medium">Map Not Configured</p>
              </div>
            )}
          </div>

          <div style={{ backgroundColor: cardBg, borderColor: borderCol, borderRadius: radius }} className="p-6 sm:p-8 border shadow-md flex flex-col justify-between space-y-6">
            <div>
              <span style={{ color: accentColor }} className="text-xs font-bold uppercase tracking-wider block mb-1">Property Address</span>
              <h3 style={{ color: textColor }} className="font-serif text-2xl font-bold mb-3">{siteSettings.businessName}</h3>
              <p style={{ color: textMuted, whiteSpace: 'pre-line' }} className="text-xs sm:text-sm leading-relaxed">{siteSettings.locationAddress}</p>

              <div className="mt-6 pt-4 space-y-2 text-xs" style={{ color: textMuted, borderTop: `1px solid ${borderCol}` }}>
                <p>🚗 <strong>Road Condition:</strong> Smooth tar road up to property</p>
                <p>🅿️ <strong>Parking:</strong> Free on-site parking available</p>
              </div>
            </div>

            <button
              onClick={openGoogleMaps}
              style={{ backgroundColor: accentColor, color: bgColor, borderRadius: radius }}
              className="w-full py-3.5 px-4 font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              id="location-get-directions-btn"
            >
              <Navigation className="w-4 h-4 fill-current" />
              <span>Get Directions on Google Maps</span>
            </button>
          </div>
        </div>

        {/* Nearby Attractions */}
        <div style={{ backgroundColor: cardBg, borderColor: borderCol, borderRadius: radius }} className="p-8 border shadow-sm space-y-6">
          <h2 style={{ color: textColor }} className="font-serif text-2xl font-bold">Nearby Sightseeing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nearbyAttractions.map((att, idx) => (
              <div key={idx} style={{ backgroundColor: bgColor, borderColor: borderCol, borderRadius: radius }} className="p-5 border space-y-1">
                <div className="flex items-center justify-between">
                  <h4 style={{ color: textColor }} className="font-bold text-sm">{att.name}</h4>
                  <span style={{ color: bgColor, backgroundColor: accentColor }} className="text-[10px] font-bold px-2 py-0.5 rounded">
                    {att.distance}
                  </span>
                </div>
                <p style={{ color: textMuted }} className="text-xs leading-relaxed pt-1">{att.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
