import { useState } from 'react';
import { 
  Check, Clock, Calendar, MessageCircle, Utensils, AlertCircle
} from 'lucide-react';
import { StayPackage, SiteSettings } from '../types';
import { SEOHead } from '../components/SEOHead';
import { buildWhatsAppUrl } from '../lib/whatsapp';

interface PackageDetailPageProps {
  pkg: StayPackage;
  siteSettings: SiteSettings;
  onNavigate: (path: string) => void;
  onOpenBookingWithItem: (item: any) => void;
}

export function PackageDetailPage({
  pkg,
  siteSettings,
  onNavigate,
  onOpenBookingWithItem,
}: PackageDetailPageProps) {
  const [checkIn, setCheckIn] = useState('');
  const [guests, setGuests] = useState(2);

  const bgColor = siteSettings?.themeColors?.background || '#FAF8F5';
  const textColor = siteSettings?.themeColors?.text || '#1F2421';
  const accentColor = siteSettings?.themeColors?.primary || '#1E3A2B';
  const cardBg = siteSettings?.themeColors?.cardBg || '#FFFFFF';
  const textMuted = siteSettings?.themeColors?.textMuted || '#666';
  const borderCol = siteSettings?.themeColors?.border || '#E5E7EB';
  const radius = siteSettings?.themeBorderRadius === 'none' ? '0' : siteSettings?.themeBorderRadius === 'sm' ? '0.125rem' : siteSettings?.themeBorderRadius === 'md' ? '0.375rem' : siteSettings?.themeBorderRadius === 'lg' ? '0.5rem' : siteSettings?.themeBorderRadius === 'xl' ? '0.75rem' : '1rem';

  if (!pkg) {
    return (
      <div style={{ backgroundColor: bgColor, minHeight: '60vh' }} className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-3" style={{ color: textColor }}>Package Not Found</h2>
        <p className="text-sm mb-6 max-w-md" style={{ color: textMuted }}>
          The requested package could not be located. It may have expired or been updated.
        </p>
        <button
          onClick={() => onNavigate('/packages')}
          className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-opacity hover:opacity-90 shadow-md"
          style={{ backgroundColor: accentColor, color: '#FAF8F5' }}
        >
          Browse All Packages
        </button>
      </div>
    );
  }

  const getWhatsAppMessage = () => {
    return `Hello ${siteSettings.businessName}! I want to enquire about the package "${pkg.name}".\n\nDate: ${checkIn || 'Not decided'}\nGuests: ${guests}\n\nPlease let me know the availability and total pricing.`;
  };

  const whatsappUrl = buildWhatsAppUrl(siteSettings.whatsappNumber, getWhatsAppMessage());

  return (
    <div style={{ backgroundColor: bgColor, minHeight: '100vh', paddingBottom: '6rem' }}>
      <SEOHead
        title={`${pkg.name} | ${siteSettings.businessName}`}
        description={pkg.shortDescription}
      />

      {/* Hero Header */}
      <div className="relative h-[50vh] min-h-[400px] w-full bg-stone-900">
        <img
          src={pkg.coverImage}
          alt={pkg.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-end" style={{ background: `linear-gradient(to top, ${bgColor}, transparent)` }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
            <span style={{ backgroundColor: accentColor, color: bgColor }} className="text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              {pkg.category}
            </span>
            <h1 style={{ color: textColor }} className="font-serif text-3xl sm:text-5xl font-bold mt-2 flex flex-col sm:flex-row sm:items-center gap-3">
              <span>{pkg.name}</span>
              {pkg.accommodationType && (
                <span className="inline-flex items-center gap-1 bg-[#C5A059] text-stone-950 text-xs font-black px-3 py-1 rounded-md shadow-lg self-start sm:self-auto uppercase tracking-wider">
                  <span>🏡</span>
                  <span>{pkg.accommodationType}</span>
                </span>
              )}
            </h1>
            <div style={{ color: textMuted }} className="flex items-center gap-4 text-xs sm:text-sm mt-2 font-medium">
              <span className="flex items-center gap-1">
                <Clock style={{ color: accentColor }} className="w-4 h-4" /> {pkg.duration}
              </span>
              <span>•</span>
              <span style={{ color: textColor }} className="font-bold">
                {pkg.price.isPriceOnRequest || !pkg.price.amount
                  ? 'Price on Request'
                  : `Starting ${pkg.price.currency}${pkg.price.amount.toLocaleString('en-IN')} ${pkg.price.unit}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Info Columns */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview */}
            <div style={{ backgroundColor: cardBg, borderColor: borderCol, borderRadius: radius }} className="p-6 sm:p-8 border shadow-sm space-y-4">
              <h2 style={{ color: textColor }} className="font-serif text-2xl font-bold">Package Overview</h2>
              <p style={{ color: textMuted }} className="text-sm leading-relaxed">{pkg.fullDescription}</p>
            </div>

            {/* Inclusions & Meals */}
            <div style={{ backgroundColor: cardBg, borderColor: borderCol, borderRadius: radius }} className="p-6 sm:p-8 border shadow-sm space-y-6">
              <h2 style={{ color: textColor }} className="font-serif text-2xl font-bold">What's Included</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pkg.inclusions.map((inc, i) => (
                  <div key={i} style={{ backgroundColor: bgColor, borderColor: borderCol, borderRadius: radius }} className="p-4 border">
                    <h4 style={{ color: textColor }} className="font-bold text-sm flex items-center gap-2">
                      <Check style={{ color: accentColor }} className="w-4 h-4" /> {inc.title}
                    </h4>
                    <p style={{ color: textMuted }} className="text-xs mt-1">{inc.description}</p>
                  </div>
                ))}
              </div>

              {/* Meals Included */}
              <div className="pt-4" style={{ borderTop: `1px solid ${borderCol}` }}>
                <h3 style={{ color: textColor }} className="font-serif text-lg font-bold mb-3 flex items-center gap-2">
                  <Utensils style={{ color: accentColor }} className="w-5 h-5" /> Meals Provided
                </h3>
                <div className="flex flex-wrap gap-2">
                  {pkg.mealsIncluded.map((meal, idx) => (
                    <span
                      key={idx}
                      style={{ backgroundColor: bgColor, borderColor: borderCol, color: textColor }}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl border"
                    >
                      ✓ {meal}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Itinerary Timeline */}
            <div style={{ backgroundColor: cardBg, borderColor: borderCol, borderRadius: radius }} className="p-6 sm:p-8 border shadow-sm space-y-6">
              <h2 style={{ color: textColor }} className="font-serif text-2xl font-bold">Suggested Itinerary Schedule</h2>
              <div className="space-y-4 relative ml-3 pl-6" style={{ borderLeft: `2px solid ${accentColor}` }}>
                {pkg.itinerary.map((item, idx) => (
                  <div key={idx} className="relative">
                    <span style={{ backgroundColor: cardBg, borderColor: accentColor }} className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2" />
                    <span style={{ color: accentColor }} className="text-xs font-bold block uppercase tracking-wider">{item.time}</span>
                    <h4 style={{ color: textColor }} className="font-bold text-base mt-0.5">{item.title}</h4>
                    <p style={{ color: textMuted }} className="text-xs mt-1 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Things to Carry */}
            <div style={{ backgroundColor: cardBg, borderColor: borderCol, borderRadius: radius }} className="p-6 sm:p-8 border shadow-sm space-y-4">
              <h2 style={{ color: textColor }} className="font-serif text-2xl font-bold">Things to Carry & Guidelines</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm" style={{ color: textColor }}>
                {pkg.thingsToCarry.map((item, idx) => (
                  <li key={idx} style={{ backgroundColor: bgColor, borderRadius: radius }} className="flex items-center gap-2 p-2.5">
                    <AlertCircle style={{ color: accentColor }} className="w-4 h-4 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Important Info & Booking System */}
            {pkg.importantInfo && pkg.importantInfo.length > 0 && (
              <div style={{ backgroundColor: cardBg, borderColor: borderCol, borderRadius: radius }} className="p-6 sm:p-8 border shadow-sm space-y-4">
                <h2 style={{ color: textColor }} className="font-serif text-2xl font-bold">Booking System & Guidelines</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm" style={{ color: textColor }}>
                  {pkg.importantInfo.map((info, idx) => (
                    <li key={idx} style={{ backgroundColor: bgColor, borderRadius: radius }} className="flex items-center gap-2 p-2.5">
                      <Check style={{ color: accentColor }} className="w-4 h-4 shrink-0" />
                      <span className="font-medium">{info}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sticky Booking Sidebar */}
          <div>
            <div style={{ backgroundColor: cardBg, borderColor: borderCol, borderRadius: radius }} className="p-6 border shadow-xl sticky top-24 space-y-5">
              <div className="pb-4" style={{ borderBottom: `1px solid ${borderCol}` }}>
                <span style={{ color: textMuted }} className="text-xs uppercase font-bold tracking-wider">Package Enquiry</span>
                <h3 style={{ color: textColor }} className="font-serif text-xl font-bold mt-1">{pkg.name}</h3>
                <p style={{ color: accentColor }} className="text-xs font-bold mt-1">
                  {pkg.price.isPriceOnRequest || !pkg.price.amount
                    ? 'Price on Request'
                    : `${pkg.price.currency}${pkg.price.amount.toLocaleString('en-IN')} ${pkg.price.unit}`}
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label style={{ color: textMuted }} className="text-[11px] font-bold uppercase block mb-1">Preferred Check-in Date</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    style={{ backgroundColor: bgColor, color: textColor, borderColor: borderCol }}
                    className="w-full border rounded-xl p-2.5 text-xs font-semibold focus:ring-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label style={{ color: textMuted }} className="text-[11px] font-bold uppercase block mb-1">Number of Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    style={{ backgroundColor: bgColor, color: textColor, borderColor: borderCol }}
                    className="w-full border rounded-xl p-2.5 text-xs font-semibold focus:ring-2 focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12, 15].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => onOpenBookingWithItem(pkg)}
                  style={{ backgroundColor: accentColor, color: bgColor, borderRadius: radius }}
                  className="w-full py-3 px-4 font-bold text-xs uppercase tracking-wider shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  id="pkg-detail-book-now-btn"
                >
                  <Calendar className="w-4 h-4 fill-current" />
                  <span>Book This Package</span>
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
                  id="pkg-detail-whatsapp-btn"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Enquire on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
