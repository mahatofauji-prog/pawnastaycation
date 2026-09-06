import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  MessageCircle,
  CheckCircle2,
  ChevronRight,
  Info,
  X,
  Tag,
  Star,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { ServiceItem, SiteSettings } from '../types';
import { buildWhatsAppUrl } from '../lib/whatsapp';

interface ServicesFacilitiesSectionProps {
  services: ServiceItem[];
  siteSettings: SiteSettings;
  onOpenBookingModal?: () => void;
  isStandalonePage?: boolean;
}

export const ServicesFacilitiesSection: React.FC<ServicesFacilitiesSectionProps> = ({
  services,
  siteSettings,
  onOpenBookingModal,
  isStandalonePage = false,
}) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);

  const colors = siteSettings.themeColors;
  const radius =
    siteSettings.themeBorderRadius === 'none'
      ? '0px'
      : siteSettings.themeBorderRadius === 'sm'
      ? '4px'
      : siteSettings.themeBorderRadius === 'md'
      ? '8px'
      : siteSettings.themeBorderRadius === 'lg'
      ? '12px'
      : siteSettings.themeBorderRadius === 'xl'
      ? '16px'
      : '24px';

  const sectionSettings = siteSettings.serviceSectionSettings || {
    eyebrow: 'EXPERIENCES & FACILITIES',
    heading: 'Everything You Need for a Perfect Pawna Escape',
    subtitle: 'From delicious food and BBQ evenings to lakeside views, bonfires and unforgettable experiences.',
    description: 'Immerse yourself in nature without compromising on modern conveniences. We provide all the amenities, activities, and dining arrangements to make your stay effortless and memorable.',
    enabled: true,
    gridLayout: '3-cols',
    maxVisible: 0,
    ctaText: 'ENQUIRE ON WHATSAPP',
  };

  // Filter only active services for public website and sort by displayOrder
  const activeServices = services
    .filter((s) => s.status === 'Active')
    .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));

  const visibleServices =
    !isStandalonePage && sectionSettings.maxVisible && sectionSettings.maxVisible > 0
      ? activeServices.slice(0, sectionSettings.maxVisible)
      : activeServices;

  const getWhatsAppServiceUrl = (service: ServiceItem) => {
    const priceText =
      service.pricingType === 'Included'
        ? 'Included in Stay'
        : service.pricingType === 'Paid'
        ? `₹${service.price} / ${service.priceUnit || 'Per Person'}`
        : 'Price on Request';

    const text = `Hello ${siteSettings.businessName},\n\nI am interested in the *${service.name}* service (${priceText}).\n\nPlease share availability, details, and booking information.`;
    return buildWhatsAppUrl(siteSettings.whatsappNumber, text);
  };

  const getGeneralWhatsAppUrl = () => {
    const text = `Hello ${siteSettings.businessName},\n\nI want to enquire about your Services & Facilities at Pawna Lake.`;
    return buildWhatsAppUrl(siteSettings.whatsappNumber, text);
  };

  const gridClass = 'grid-cols-2';

  if (!sectionSettings.enabled && !isStandalonePage) {
    return null;
  }

  return (
    <section
      id="services-facilities-section"
      className={`${isStandalonePage ? 'py-12' : 'py-20'} relative overflow-hidden`}
      style={{
        backgroundColor: isStandalonePage ? colors.background : 'transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-widest shadow-sm"
            style={{
              borderColor: `${colors.primary}40`,
              backgroundColor: `${colors.primary}12`,
              color: colors.primary,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{sectionSettings.eyebrow || 'EXPERIENCES & FACILITIES'}</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light tracking-tight leading-tight"
            style={{ color: colors.text }}
          >
            {sectionSettings.heading || 'Everything You Need for a Perfect Pawna Escape'}
          </h2>

          {sectionSettings.subtitle && (
            <p
              className="text-base sm:text-lg font-light leading-relaxed"
              style={{ color: colors.textMuted }}
            >
              {sectionSettings.subtitle}
            </p>
          )}

          {sectionSettings.description && isStandalonePage && (
            <p
              className="text-sm sm:text-base font-light leading-relaxed max-w-2xl mx-auto pt-2"
              style={{ color: colors.textMuted }}
            >
              {sectionSettings.description}
            </p>
          )}
        </div>

        {/* Services Grid */}
        <div className={`grid ${gridClass} gap-3.5 sm:gap-6 lg:gap-8`}>
          {visibleServices.map((service, index) => {
            const isIncluded = service.pricingType === 'Included';
            const isPaid = service.pricingType === 'Paid';
            const isRequest = service.pricingType === 'Price on Request';

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative flex flex-col justify-between overflow-hidden border shadow-lg hover:shadow-2xl transition-all duration-300"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.border,
                  borderRadius: radius,
                }}
              >
                <div>
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-black/20">
                    <img
                      src={service.mainImage || 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80'}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                      {/* Price Badge */}
                      {isIncluded && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600/90 text-white backdrop-blur-md shadow-md">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Included in Stay</span>
                        </span>
                      )}
                      {isPaid && (
                        <span
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-black shadow-md backdrop-blur-md"
                          style={{ backgroundColor: colors.accent || '#FDE68A' }}
                        >
                          <Tag className="w-3.5 h-3.5" />
                          <span>
                            ₹{service.price?.toLocaleString('en-IN')}{' '}
                            <span className="text-[10px] font-medium opacity-80">
                              / {service.priceUnit || 'Per Person'}
                            </span>
                          </span>
                        </span>
                      )}
                      {isRequest && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-sky-600/90 text-white backdrop-blur-md shadow-md">
                          <span>Price on Request</span>
                        </span>
                      )}

                      {/* Featured Star */}
                      {service.featured && (
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-amber-900 bg-amber-300 shadow-md ml-auto"
                        >
                          <Star className="w-3 h-3 fill-amber-900" />
                          <span>Featured</span>
                        </span>
                      )}
                    </div>

                    {/* Service Icon and Name overlay on bottom of image */}
                    <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center gap-2.5">
                      {service.icon && (
                        <span className="text-2xl drop-shadow-md flex-shrink-0">
                          {service.icon}
                        </span>
                      )}
                      <h3 className="text-xl font-bold text-white drop-shadow-md truncate font-serif">
                        {service.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <p
                      className="text-sm leading-relaxed line-clamp-3 font-light"
                      style={{ color: colors.textMuted }}
                    >
                      {service.shortDescription || service.fullDescription || 'Experience exceptional lakeside service and amenities.'}
                    </p>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div
                  className="p-4 sm:p-5 pt-3 border-t flex flex-col sm:flex-row items-center gap-2.5"
                  style={{ borderColor: colors.border }}
                >
                  <button
                    onClick={() => {
                      setSelectedService(service);
                      setActiveGalleryIndex(0);
                    }}
                    className="w-full sm:w-1/2 py-2.5 px-3 rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border"
                    style={{
                      borderColor: colors.border,
                      color: colors.text,
                      backgroundColor: 'transparent',
                    }}
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>

                  <a
                    href={getWhatsAppServiceUrl(service)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-1/2 py-2.5 px-3 rounded text-xs font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white" />
                    <span>Enquire Now</span>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Standalone or Section Footer CTA */}
        <div className="mt-14 p-8 rounded-2xl border text-center space-y-4 shadow-xl relative overflow-hidden"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.border,
          }}
        >
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <h3 className="text-2xl font-serif font-light" style={{ color: colors.text }}>
              Looking for custom group arrangements or special setup?
            </h3>
            <p className="text-sm font-light" style={{ color: colors.textMuted }}>
              From birthday & anniversary celebrations to corporate offsites, live acoustic guitar jamming, and watersports packages, our team can curate the perfect setup for you.
            </p>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
              <a
                href={getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded text-xs uppercase tracking-wider font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg inline-flex items-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>{sectionSettings.ctaText || 'Chat with Team on WhatsApp'}</span>
              </a>
              {onOpenBookingModal && (
                <button
                  onClick={onOpenBookingModal}
                  className="px-6 py-3 rounded text-xs uppercase tracking-wider font-bold border hover:opacity-90 transition-all"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.background,
                    borderColor: colors.primary,
                  }}
                >
                  Book Your Staycation
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Service Details Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl border shadow-2xl my-8"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.border,
                color: colors.text,
              }}
            >
              {/* Modal Close Button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Main Image Banner */}
              <div className="relative aspect-[16/9] bg-black/40 overflow-hidden">
                <img
                  src={
                    (selectedService.galleryImages && selectedService.galleryImages[activeGalleryIndex]) ||
                    selectedService.mainImage ||
                    'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={selectedService.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {selectedService.icon && (
                      <span className="text-3xl">{selectedService.icon}</span>
                    )}
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                        {selectedService.name}
                      </h3>
                      <p className="text-xs text-white/80 font-medium">
                        Pawna Lake Facility & Experience
                      </p>
                    </div>
                  </div>

                  {/* Pricing Badge */}
                  <div>
                    {selectedService.pricingType === 'Included' && (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-lg">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Included in Stay</span>
                      </span>
                    )}
                    {selectedService.pricingType === 'Paid' && (
                      <span
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-black shadow-lg"
                        style={{ backgroundColor: colors.accent || '#FDE68A' }}
                      >
                        <Tag className="w-4 h-4" />
                        <span>
                          ₹{selectedService.price?.toLocaleString('en-IN')}{' '}
                          <span className="text-[10px] opacity-80">
                            / {selectedService.priceUnit || 'Per Person'}
                          </span>
                        </span>
                      </span>
                    )}
                    {selectedService.pricingType === 'Price on Request' && (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-sky-600 text-white shadow-lg">
                        <span>Price on Request</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Gallery Thumbnails if multiple images exist */}
              {selectedService.galleryImages && selectedService.galleryImages.length > 1 && (
                <div className="px-6 pt-3 flex items-center gap-2 overflow-x-auto pb-1">
                  {selectedService.galleryImages.map((imgUrl, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveGalleryIndex(i)}
                      className={`relative w-16 h-12 rounded-md overflow-hidden border-2 flex-shrink-0 transition-all ${
                        activeGalleryIndex === i ? 'border-amber-400 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`${selectedService.name} ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Modal Body */}
              <div className="p-6 space-y-4 max-h-[45vh] overflow-y-auto">
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-bold mb-1.5" style={{ color: colors.primary }}>
                    Overview
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: colors.text }}>
                    {selectedService.shortDescription}
                  </p>
                </div>

                {selectedService.fullDescription && selectedService.fullDescription !== selectedService.shortDescription && (
                  <div>
                    <h4 className="text-xs uppercase tracking-widest font-bold mb-1.5" style={{ color: colors.primary }}>
                      Complete Details & Inclusions
                    </h4>
                    <p className="text-sm leading-relaxed whitespace-pre-line font-light" style={{ color: colors.textMuted }}>
                      {selectedService.fullDescription}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div
                className="p-6 pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
                style={{ borderColor: colors.border }}
              >
                <div className="text-xs" style={{ color: colors.textMuted }}>
                  Instant WhatsApp support & live confirmation
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedService(null)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded text-xs font-semibold border"
                    style={{ borderColor: colors.border, color: colors.text }}
                  >
                    Close
                  </button>
                  <a
                    href={getWhatsAppServiceUrl(selectedService)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-2.5 rounded text-xs font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] flex items-center justify-center gap-2 shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Enquire on WhatsApp</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
