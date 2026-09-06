import { Tent, Award, ShieldCheck, Heart, MapPin } from 'lucide-react';
import { SiteSettings } from '../types';
import { SEOHead } from '../components/SEOHead';

interface AboutPageProps {
  siteSettings: SiteSettings;
  onNavigate: (path: string) => void;
}

export function AboutPage({ siteSettings, onNavigate }: AboutPageProps) {
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
        title={`About Us | ${siteSettings.businessName}`}
        description={siteSettings.shortDescription}
      />

      <div style={{ backgroundColor: cardBg, color: textColor, borderBottom: `1px solid ${borderCol}` }} className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <span style={{ color: accentColor }} className="text-xs font-bold uppercase tracking-widest block mb-2">
            Outdoor Luxury Hospitality
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">
            About {siteSettings.businessName}
          </h1>
          <p style={{ color: textMuted }} className="text-sm sm:text-base max-w-2xl mx-auto mt-3">
            {siteSettings.tagline}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-16">
        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span style={{ color: accentColor }} className="text-xs font-bold uppercase tracking-widest">Our Beginnings</span>
            <h2 style={{ color: textColor }} className="font-serif text-3xl font-bold">Our Story</h2>
            <p style={{ color: textMuted }} className="text-sm leading-relaxed">
              {siteSettings.aboutDescription}
            </p>
            <p style={{ color: textMuted }} className="text-sm leading-relaxed">
              We believe a weekend getaway should combine the raw beauty of nature with modern comforts, pristine hygiene, and warm hospitality.
            </p>
          </div>
          <div style={{ borderRadius: radius, borderColor: borderCol }} className="overflow-hidden shadow-2xl aspect-[4/3] border">
            <img
              src={siteSettings.heroImages[0] || "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1000&q=80"}
              alt={`${siteSettings.businessName} Story`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Mission & Values */}
        <div style={{ backgroundColor: cardBg, borderColor: borderCol, borderRadius: radius }} className="p-8 border shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2 text-center md:text-left">
            <div style={{ backgroundColor: bgColor, color: accentColor }} className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto md:mx-0">
              <Heart className="w-5 h-5" />
            </div>
            <h3 style={{ color: textColor }} className="font-serif text-xl font-bold">Our Mission</h3>
            <p style={{ color: textMuted }} className="text-xs leading-relaxed">
              To provide seamless, peaceful, and memorable outdoor stays for couples, families, and groups, backed by transparent pricing and verified safety.
            </p>
          </div>
          <div className="space-y-2 text-center md:text-left">
            <div style={{ backgroundColor: bgColor, color: accentColor }} className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto md:mx-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 style={{ color: textColor }} className="font-serif text-xl font-bold">Safety & Hygiene</h3>
            <p style={{ color: textMuted }} className="text-xs leading-relaxed">
              24/7 security staff, sanitized washrooms, mandatory safety procedures, and family-first property guidelines.
            </p>
          </div>
          <div className="space-y-2 text-center md:text-left">
            <div style={{ backgroundColor: bgColor, color: accentColor }} className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto md:mx-0">
              <Award className="w-5 h-5" />
            </div>
            <h3 style={{ color: textColor }} className="font-serif text-xl font-bold">Locally Sourced</h3>
            <p style={{ color: textMuted }} className="text-xs leading-relaxed">
              Authentic regional dishes, fresh BBQ marinades, and fresh morning breakfast prepared daily by local chefs.
            </p>
          </div>
        </div>

        {/* What Makes Us Different */}
        <div className="text-center space-y-6">
          <h2 style={{ color: textColor }} className="font-serif text-3xl font-bold">What Makes Us Different?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div style={{ backgroundColor: cardBg, borderColor: borderCol, borderRadius: radius }} className="p-6 border">
              <h4 style={{ color: textColor }} className="font-bold text-base mb-1">Prime Location</h4>
              <p style={{ color: textMuted }} className="text-xs leading-relaxed">Our property is situated in a prime area with zero blocked views or highway noise.</p>
            </div>
            <div style={{ backgroundColor: cardBg, borderColor: borderCol, borderRadius: radius }} className="p-6 border">
              <h4 style={{ color: textColor }} className="font-bold text-base mb-1">Diverse Accommodations</h4>
              <p style={{ color: textMuted }} className="text-xs leading-relaxed">From budget-friendly stays to luxury AC suites with attached washrooms.</p>
            </div>
            <div style={{ backgroundColor: cardBg, borderColor: borderCol, borderRadius: radius }} className="p-6 border">
              <h4 style={{ color: textColor }} className="font-bold text-base mb-1">Dedicated Hospitality Team</h4>
              <p style={{ color: textMuted }} className="text-xs leading-relaxed">On-site managers available round the clock for your setup, serving, and activities.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
