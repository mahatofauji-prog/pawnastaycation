import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Tag,
  Star,
  MessageCircle,
  ChevronRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { ServiceItem, SiteSettings } from '../types';
import { ServicesFacilitiesSection } from '../components/ServicesFacilitiesSection';

interface ServicesPageProps {
  services: ServiceItem[];
  siteSettings: SiteSettings;
  onOpenBookingWithItem: (name?: string, id?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  services,
  siteSettings,
  onOpenBookingWithItem,
}) => {
  const [filterType, setFilterType] = useState<'All' | 'Included' | 'Paid' | 'Featured'>('All');
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filtered services
  const filteredServices = useMemo(() => {
    return services
      .filter((s) => s.status === 'Active')
      .filter((s) => {
        if (filterType === 'Included') return s.pricingType === 'Included';
        if (filterType === 'Paid') return s.pricingType === 'Paid';
        if (filterType === 'Featured') return s.featured === true;
        return true;
      })
      .filter((s) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.shortDescription.toLowerCase().includes(q) ||
          (s.fullDescription && s.fullDescription.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
  }, [services, filterType, searchQuery]);

  const rawWhatsapp = (siteSettings.whatsappNumber || '918793020527').replace(/[^0-9]/g, '');

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: colors.background,
        color: colors.text,
      }}
    >
      {/* Hero Banner */}
      <section className="relative py-20 lg:py-28 overflow-hidden border-b" style={{ borderColor: colors.border }}>
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1600&q=80"
            alt="Services at Pawna Lake"
            className="w-full h-full object-cover brightness-[0.35]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-widest backdrop-blur-md"
            style={{
              borderColor: `${colors.primary}60`,
              backgroundColor: `${colors.primary}25`,
              color: colors.accent || colors.primary,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Amenities & Facilities</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Lakeside Services & Exceptional Facilities
          </h1>

          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
            Every stay at {siteSettings.businessName} includes delicious meals, live barbecue, bonfire jamming, outdoor activities, and serene waterfront relaxation.
          </p>

          {/* Quick Filters and Search */}
          <div className="pt-6 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
            {/* Search Input */}
            <div
              className="w-full sm:w-72 relative rounded-full overflow-hidden border backdrop-blur-md shadow-lg"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />
              <input
                type="text"
                placeholder="Search food, BBQ, sports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 text-xs text-white placeholder-white/50 bg-transparent focus:outline-none"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {(['All', 'Included', 'Paid', 'Featured'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all backdrop-blur-md ${
                    filterType === type
                      ? 'bg-amber-400 text-black shadow-lg font-bold scale-105'
                      : 'bg-black/40 text-white/80 border border-white/20 hover:bg-white/10'
                  }`}
                >
                  {type === 'All' && 'All Services'}
                  {type === 'Included' && '✓ Included in Stays'}
                  {type === 'Paid' && '🏷️ Add-ons & Stays'}
                  {type === 'Featured' && '⭐ Featured'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {filteredServices.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <Compass className="w-12 h-12 mx-auto opacity-40" />
            <h3 className="text-xl font-serif font-light">No services match your search</h3>
            <p className="text-sm font-light opacity-70">
              Try adjusting your search keywords or clearing filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterType('All');
              }}
              className="px-5 py-2 rounded text-xs font-semibold border"
              style={{ borderColor: colors.border }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <ServicesFacilitiesSection
            services={filteredServices}
            siteSettings={siteSettings}
            onOpenBookingModal={() => onOpenBookingWithItem()}
            isStandalonePage={true}
          />
        )}
      </div>

      {/* Trust & Guarantee Strip */}
      <section className="border-t py-12" style={{ borderColor: colors.border, backgroundColor: colors.cardBg }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
              >
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold font-serif" style={{ color: colors.text }}>
                  100% Genuine Stays & Services
                </h4>
                <p className="text-xs font-light" style={{ color: colors.textMuted }}>
                  All services listed are operated directly on our private Pawna Lake campsite with full safety compliance.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
              >
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold font-serif" style={{ color: colors.text }}>
                  Family & Couple Safe
                </h4>
                <p className="text-xs font-light" style={{ color: colors.textMuted }}>
                  24/7 on-site staff, clean sanitized washrooms, family-friendly atmosphere, and well-lit campground.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
              >
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold font-serif" style={{ color: colors.text }}>
                  Instant WhatsApp Booking
                </h4>
                <p className="text-xs font-light" style={{ color: colors.textMuted }}>
                  Direct chat with campsite managers for customized food preferences, private setup, and instant confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
