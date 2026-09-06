import { useState, useMemo } from 'react';
import { 
  Check, Users, BedDouble, Tent, Ruler, Waves, MapPin, Sparkles, 
  ChevronRight, Calendar, MessageCircle, Phone 
} from 'lucide-react';
import { Stay, FAQItem, SiteSettings } from '../types';
import { LightboxModal } from '../components/LightboxModal';
import { SEOHead } from '../components/SEOHead';
import { buildWhatsAppUrl, buildStayEnquiryWhatsAppMsg } from '../lib/whatsapp';

interface StayDetailPageProps {
  stay: Stay;
  faqs?: FAQItem[];
  allFaqs?: FAQItem[];
  siteSettings: SiteSettings;
  onNavigate: (path: string) => void;
  onOpenBookingWithItem: (item: any) => void;
}

export function StayDetailPage({ stay, faqs, allFaqs, siteSettings, onNavigate, onOpenBookingWithItem }: StayDetailPageProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const bgColor = siteSettings?.themeColors?.background || '#FAF8F5';
  const textColor = siteSettings?.themeColors?.text || '#1F2421';
  const accentColor = siteSettings?.themeColors?.primary || '#1E3A2B';
  const cardBg = siteSettings?.themeColors?.cardBg || '#FFFFFF';
  const textMuted = siteSettings?.themeColors?.textMuted || '#666';

  const listFaqs = allFaqs || faqs || [];
  const stayFaqs = useMemo(() => {
    return listFaqs.filter((faq) => faq.category === 'Stay' || faq.category === 'Booking');
  }, [listFaqs]);

  if (!stay) {
    return (
      <div style={{ backgroundColor: bgColor, minHeight: '60vh' }} className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-3" style={{ color: textColor }}>Accommodation Not Found</h2>
        <p className="text-sm mb-6 max-w-md" style={{ color: textMuted }}>
          The requested accommodation could not be located. It may have been updated or moved.
        </p>
        <button
          onClick={() => onNavigate('/stays')}
          className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-opacity hover:opacity-90 shadow-md"
          style={{ backgroundColor: accentColor, color: '#FAF8F5' }}
        >
          Browse All Accommodations
        </button>
      </div>
    );
  }

  const galleryList = stay.galleryImages && stay.galleryImages.length > 0 ? stay.galleryImages : [stay.mainImage];

  const handleOpenLightbox = (index: number) => {
    setSelectedImgIndex(index);
    setLightboxOpen(true);
  };

  const phoneNum = siteSettings.phone || '+91 8793020527';
  const phoneClean = phoneNum.replace(/[^0-9+]/g, '');
  const whatsappUrl = buildWhatsAppUrl(
    siteSettings.whatsappNumber,
    buildStayEnquiryWhatsAppMsg(stay.name, stay.price.amount, checkIn, checkOut, guests)
  );

  const borderCol = siteSettings.themeColors.border;
  const radius = siteSettings.themeBorderRadius === 'none' ? '0' : siteSettings.themeBorderRadius === 'sm' ? '0.125rem' : siteSettings.themeBorderRadius === 'md' ? '0.375rem' : siteSettings.themeBorderRadius === 'lg' ? '0.5rem' : siteSettings.themeBorderRadius === 'xl' ? '0.75rem' : '1rem';

  return (
    <div style={{ backgroundColor: bgColor, minHeight: '100vh', paddingBottom: '6rem' }}>
      <SEOHead
        title={`${stay.name} | ${siteSettings.businessName}`}
        description={stay.description}
      />

      <div style={{ backgroundColor: cardBg, color: textColor, borderBottom: `1px solid ${borderCol}` }} className="pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: accentColor }}>
            <span className="cursor-pointer hover:underline" onClick={() => onNavigate('/stays')}>Stays</span>
            <span>/</span>
            <span style={{ color: textMuted }}>{stay.type}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold">{stay.name}</h1>
              <div className="flex items-center gap-4 mt-2" style={{ color: textMuted }}>
                <span className="flex items-center gap-1 text-xs font-medium"><MapPin className="w-3.5 h-3.5" /> {stay.location}</span>
                {stay.isLakeView && <span className="flex items-center gap-1 text-xs font-medium"><Waves className="w-3.5 h-3.5" /> Lake View</span>}
              </div>
            </div>
            <div className="text-left md:text-right">
              <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: textMuted }}>Starts from</span>
              <div className="text-2xl font-bold font-serif" style={{ color: accentColor }}>
                {stay.price.isPriceOnRequest || !stay.price.amount
                  ? 'Price on Request'
                  : `${stay.price.currency}${stay.price.amount.toLocaleString('en-IN')}`}
                {!stay.price.isPriceOnRequest && stay.price.amount && (
                  <span className="text-sm font-sans font-medium ml-1" style={{ color: textMuted }}>/ {stay.price.period}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-3 h-[40vh] md:h-[60vh]">
          <div 
            className="md:col-span-2 md:row-span-2 relative cursor-pointer overflow-hidden group"
            style={{ borderRadius: radius }}
            onClick={() => handleOpenLightbox(0)}
          >
            <img src={galleryList[0]} alt={stay.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          </div>
          
          {galleryList.slice(1, 5).map((img, idx) => (
            <div 
              key={idx} 
              className={`relative cursor-pointer overflow-hidden group ${idx >= 2 ? 'hidden md:block' : ''}`}
              style={{ borderRadius: radius }}
              onClick={() => handleOpenLightbox(idx + 1)}
            >
              <img src={img} alt={`${stay.name} ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              {idx === 3 && galleryList.length > 5 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white font-bold text-sm tracking-widest uppercase">+{galleryList.length - 5} More</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          <div className="lg:col-span-2 space-y-10">
            {/* Overview */}
            <div style={{ backgroundColor: cardBg, borderColor: borderCol, borderRadius: radius }} className="p-6 sm:p-8 border shadow-xl space-y-4">
              <h2 style={{ color: textColor }} className="font-serif text-2xl font-bold">Property Overview</h2>
              <p style={{ color: textMuted }} className="text-sm leading-relaxed whitespace-pre-wrap">{stay.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4" style={{ borderTop: `1px solid ${borderCol}` }}>
                <div style={{ backgroundColor: bgColor, borderColor: borderCol, borderRadius: radius }} className="p-3 border">
                  <span style={{ color: textMuted }} className="text-[10px] font-bold uppercase block">Capacity</span>
                  <span style={{ color: textColor }} className="text-xs font-bold">{stay.capacity.minGuests} - {stay.capacity.maxGuests} Guests</span>
                </div>
                <div style={{ backgroundColor: bgColor, borderColor: borderCol, borderRadius: radius }} className="p-3 border">
                  <span style={{ color: textMuted }} className="text-[10px] font-bold uppercase block">Ideal For</span>
                  <span style={{ color: textColor }} className="text-xs font-bold">{stay.capacity.idealFor}</span>
                </div>
                <div style={{ backgroundColor: bgColor, borderColor: borderCol, borderRadius: radius }} className="p-3 border">
                  <span style={{ color: textMuted }} className="text-[10px] font-bold uppercase block">Check-in</span>
                  <span style={{ color: textColor }} className="text-xs font-bold">{stay.checkInTime}</span>
                </div>
                <div style={{ backgroundColor: bgColor, borderColor: borderCol, borderRadius: radius }} className="p-3 border">
                  <span style={{ color: textMuted }} className="text-[10px] font-bold uppercase block">Check-out</span>
                  <span style={{ color: textColor }} className="text-xs font-bold">{stay.checkOutTime}</span>
                </div>
              </div>
            </div>

            {/* Amenities Grid */}
            <div style={{ backgroundColor: cardBg, borderColor: borderCol, borderRadius: radius }} className="p-6 sm:p-8 border shadow-xl space-y-4">
              <h2 style={{ color: textColor }} className="font-serif text-2xl font-bold">Available Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {stay.amenities.map((amenity, idx) => (
                  <div key={idx} style={{ backgroundColor: bgColor, borderColor: borderCol, borderRadius: radius }} className="p-3 border flex items-center gap-2.5 text-xs font-bold text-stone-700">
                    <Check style={{ color: accentColor }} className="w-4 h-4 shrink-0" />
                    <span style={{ color: textColor }}>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What's Included */}
            <div style={{ backgroundColor: cardBg, borderColor: borderCol, borderRadius: radius }} className="p-6 sm:p-8 border shadow-xl space-y-4">
              <h2 style={{ color: textColor }} className="font-serif text-2xl font-bold">What's Included in Package</h2>
              <ul className="space-y-2.5">
                {stay.whatsIncluded.map((inc, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-stone-700">
                    <Sparkles style={{ color: accentColor }} className="w-4 h-4 shrink-0 mt-0.5" />
                    <span style={{ color: textColor }}>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* House Rules & Policies */}
            <div style={{ backgroundColor: cardBg, borderColor: borderCol, borderRadius: radius }} className="p-6 sm:p-8 border shadow-xl space-y-4">
              <h2 style={{ color: textColor }} className="font-serif text-2xl font-bold">House Rules & Policies</h2>
              <ul className="space-y-2 text-xs sm:text-sm">
                {stay.houseRules.map((rule, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span style={{ backgroundColor: accentColor }} className="w-1.5 h-1.5 rounded-full" />
                    <span style={{ color: textColor }}>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQs */}
            {stayFaqs.length > 0 && (
              <div style={{ backgroundColor: cardBg, borderColor: borderCol, borderRadius: radius }} className="p-6 sm:p-8 border shadow-xl space-y-4">
                <h2 style={{ color: textColor }} className="font-serif text-2xl font-bold">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {stayFaqs.map((faq) => (
                    <details key={faq.id} style={{ backgroundColor: bgColor, borderColor: borderCol, borderRadius: radius }} className="group p-4 border">
                      <summary style={{ color: textColor }} className="font-bold text-xs sm:text-sm cursor-pointer flex items-center justify-between list-none">
                        <span>{faq.question}</span>
                        <ChevronRight style={{ color: accentColor }} className="w-4 h-4 group-open:rotate-90 transition-transform" />
                      </summary>
                      <div style={{ color: textMuted, borderTopColor: borderCol }} className="text-xs mt-2 leading-relaxed pt-2 border-t">
                        {faq.answer.replace(/\+?91[\s-]?[0-9]{5}[\s-]?[0-9]{5}|\+?91[\s-]?[0-9]{10}/g, siteSettings.whatsappDisplayPhone || siteSettings.phone || '+91 8793020527')}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Sticky Enquiry & Booking Card */}
          <div>
            <div style={{ backgroundColor: cardBg, borderColor: borderCol, borderRadius: radius }} className="p-6 border shadow-2xl sticky top-24 space-y-5">
              <div className="pb-4" style={{ borderBottom: `1px solid ${borderCol}` }}>
                <span style={{ color: textMuted }} className="text-[10px] uppercase font-bold tracking-widest">Property Enquiry</span>
                <h3 style={{ color: textColor }} className="font-serif text-xl font-bold mt-1">{stay.name}</h3>
                <p style={{ color: accentColor }} className="text-xs font-bold mt-1">
                  {stay.price.isPriceOnRequest || !stay.price.amount
                    ? 'Price on Request'
                    : `${stay.price.currency}${stay.price.amount.toLocaleString('en-IN')} ${stay.price.period}`}
                </p>
              </div>

              {/* Quick Date Picker */}
              <div className="space-y-3">
                <div>
                  <label style={{ color: textMuted }} className="text-[10px] font-bold uppercase tracking-wider block mb-1">Check-in Date</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    style={{ backgroundColor: bgColor, color: textColor, borderColor: borderCol }}
                    className="w-full border rounded-xl p-2.5 text-xs font-semibold focus:ring-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label style={{ color: textMuted }} className="text-[10px] font-bold uppercase tracking-wider block mb-1">Check-out Date</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    style={{ backgroundColor: bgColor, color: textColor, borderColor: borderCol }}
                    className="w-full border rounded-xl p-2.5 text-xs font-semibold focus:ring-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label style={{ color: textMuted }} className="text-[10px] font-bold uppercase tracking-wider block mb-1">Guests</label>
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

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => onOpenBookingWithItem(stay)}
                  style={{ backgroundColor: accentColor, color: bgColor, borderRadius: radius }}
                  className="w-full py-3.5 px-4 font-bold text-xs uppercase tracking-widest shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  id="stay-detail-book-this-stay-btn"
                >
                  <Calendar className="w-4 h-4 fill-current" />
                  <span>Book This Stay</span>
                </button>
                <a
                  href={`tel:${phoneClean}`}
                  className="w-full py-3 px-4 rounded-xl border text-white font-bold text-xs uppercase tracking-widest shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
                  style={{ borderColor: borderCol, backgroundColor: cardBg, color: textColor }}
                  id="stay-detail-call-now-btn"
                >
                  <Phone style={{ color: accentColor }} className="w-4 h-4" />
                  <span>Call Now</span>
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-widest shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
                  id="stay-detail-whatsapp-btn"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
              <div style={{ backgroundColor: bgColor, borderColor: borderCol, color: textMuted, borderRadius: radius }} className="p-3 border text-[11px] leading-relaxed text-center">
                🔒 Instant response on WhatsApp. No advance fee required for checking dates.
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={galleryList.map(url => ({ url }))}
        initialIndex={selectedImgIndex}
      />
    </div>
  );
}
