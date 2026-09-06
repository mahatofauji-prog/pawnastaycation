import React from 'react';
import { MessageCircle, Compass, ArrowRight, Star, MapPin } from 'lucide-react';
import { SiteSettings, WhyChooseUsConfig } from '../types';
import { DEFAULT_WHY_CHOOSE_US_STORY } from '../data/mockData';
import { buildWhatsAppUrl } from '../lib/whatsapp';

interface WhyChooseUsStorySectionProps {
  key?: React.Key;
  siteSettings: SiteSettings;
  onExploreStays?: () => void;
}

export function WhyChooseUsStorySection({
  siteSettings,
  onExploreStays,
}: WhyChooseUsStorySectionProps) {
  const config: WhyChooseUsConfig = siteSettings.whyChooseUs || DEFAULT_WHY_CHOOSE_US_STORY;

  if (config.enabled === false) {
    return null;
  }

  const whatsappMsg = `Hello ${siteSettings.businessName}! I was reading your story on the website and would like to know more about camping packages & availability.`;
  const whatsappUrl = buildWhatsAppUrl(siteSettings.whatsappNumber, whatsappMsg);

  const googleMapsLink =
    config.googleMapsUrl ||
    siteSettings.socialLinks?.googleBusiness ||
    'https://maps.google.com/?q=Pawna+Lake+Maharashtra';

  return (
    <section
      id="why-choose-us-story"
      className="py-20 md:py-28 relative overflow-hidden bg-[#14291D] text-[#FAF8F5]"
      style={{
        borderTop: '1px solid rgba(197, 160, 89, 0.2)',
        borderBottom: '1px solid rgba(197, 160, 89, 0.2)',
      }}
    >
      {/* Subtle Ambient Background Lighting */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 bg-[#1A3A2A]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* ============================================================ */}
        {/* MAIN EDITORIAL STORY: SPLIT LAYOUT */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: Large Beautiful Pawna Lake / Campsite Image */}
          <div className="lg:col-span-5 relative group">
            <div className="relative rounded-3xl overflow-hidden border border-[#C5A059]/30 shadow-2xl bg-[#0D1C14]">
              <img
                src={config.image || DEFAULT_WHY_CHOOSE_US_STORY.image}
                alt="Pawna Lake Campsite and Mountains"
                className="w-full h-[380px] sm:h-[480px] lg:h-[580px] object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Subtle Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1C14]/80 via-transparent to-transparent pointer-events-none" />

              {/* Floating Aesthetic Heritage Badge */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 px-4 py-2 bg-[#14291D]/90 backdrop-blur-md rounded-2xl border border-[#C5A059]/40 shadow-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#FAF8F5]">
                  Est. Sept 25, 2020 • Pawna Lake
                </span>
              </div>

              {/* Floating Bottom Location Tag */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-3.5 sm:p-4 bg-[#14291D]/90 backdrop-blur-md rounded-2xl border border-[#C5A059]/30 shadow-xl">
                <div className="flex items-center gap-2 text-[#C5A059] text-xs font-semibold">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="truncate">Near Gevhande Khadak Village, Pawna Lake</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Editorial Brand Narrative */}
          <div className="lg:col-span-7 space-y-6">
            {/* Section Eyebrow */}
            <div className="inline-flex items-center gap-2.5">
              <span className="w-6 h-[1.5px] bg-[#C5A059]" />
              <span className="text-[#C5A059] text-xs font-bold uppercase tracking-[0.3em]">
                {config.eyebrow || 'WHY CHOOSE US'}
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#FAF8F5] leading-[1.18] tracking-tight">
              {config.heading || 'Your Perfect Pawna Lake Camping Experience'}
            </h2>

            {/* Editorial Paragraphs */}
            <div className="space-y-4 text-stone-300 text-sm sm:text-base leading-relaxed font-normal">
              {config.paragraph1 && (
                <p>{config.paragraph1}</p>
              )}

              {config.paragraph2 && (
                <p>{config.paragraph2}</p>
              )}

              {config.paragraph3 && (
                <p>{config.paragraph3}</p>
              )}

              {config.paragraph4 && (
                <p>{config.paragraph4}</p>
              )}
            </div>

            {/* Closing Statement */}
            {config.closingStatement && (
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0D1C14]/80 border-l-4 border-l-[#C5A059] border border-[#C5A059]/20 shadow-inner">
                <p className="font-serif italic text-base sm:text-lg text-[#F5F2ED] leading-snug">
                  "{config.closingStatement}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* HIGHLIGHT FEATURES ROW */}
        {/* ============================================================ */}
        <div className="pt-6 border-t border-[#C5A059]/20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {(config.highlights || DEFAULT_WHY_CHOOSE_US_STORY.highlights).map((item, idx) => (
              <div
                key={item.id || idx}
                className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#0D1C14]/60 border border-[#C5A059]/20 hover:border-[#C5A059]/50 transition-colors shadow-sm"
              >
                <span className="text-xl sm:text-2xl shrink-0" role="img" aria-label={item.title}>
                  {item.icon}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#FAF8F5] leading-tight">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* TRUST SECTION */}
        {/* ============================================================ */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0D1C14] border border-[#C5A059]/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#14291D] border border-[#C5A059]/40 flex items-center justify-center shrink-0 shadow">
              <Star className="w-6 h-6 text-[#C5A059] fill-[#C5A059]" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1">
                <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">
                  {config.trustTitle || 'Trusted by Campers'}
                </span>
                <div className="flex items-center text-[#C5A059] gap-0.5 ml-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#C5A059]" />
                  ))}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-stone-300">
                {config.googleReviewCount
                  ? `${config.googleReviewCount} positive evaluations on Google Maps`
                  : (config.trustDescription || 'Rated and reviewed by our guests on Google')}
              </p>
            </div>
          </div>

          <a
            href={googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-6 py-3 rounded-xl bg-[#14291D] hover:bg-[#1C3B2A] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider border border-[#C5A059]/40 hover:border-[#C5A059] transition-all flex items-center gap-2 shadow-md"
            id="story-view-google-maps-btn"
          >
            <span>View on Google Maps</span>
            <ArrowRight className="w-4 h-4 text-[#C5A059]" />
          </a>
        </div>

        {/* ============================================================ */}
        {/* BOTTOM CALL TO ACTION */}
        {/* ============================================================ */}
        <div className="pt-4 text-center space-y-4 max-w-2xl mx-auto">
          <h3 className="font-serif text-2xl sm:text-3xl text-[#FAF8F5] font-light">
            {config.ctaHeading || 'Ready for Your Pawna Escape?'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            {config.ctaSubtitle ||
              'Come experience the lake, mountains, sunsets and unforgettable camping moments with us.'}
          </p>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            {onExploreStays && (
              <button
                onClick={onExploreStays}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#C5A059] hover:bg-[#b08d4b] text-[#14291D] font-bold text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                id="story-explore-stays-btn"
              >
                <Compass className="w-4 h-4" />
                <span>{config.ctaExploreText || 'EXPLORE OUR STAYS'}</span>
              </button>
            )}

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2"
              id="story-chat-whatsapp-btn"
            >
              <MessageCircle className="w-4 h-4 fill-white text-white" />
              <span>{config.ctaWhatsappText || 'CHAT ON WHATSAPP'}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
