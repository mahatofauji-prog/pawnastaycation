import { SiteSettings } from '../types';
import { SEOHead } from '../components/SEOHead';

interface TermsPageProps {
  siteSettings: SiteSettings;
}

export function TermsPage({ siteSettings }: TermsPageProps) {
  const bgColor = siteSettings.themeColors.background;
  const textColor = siteSettings.themeColors.text;
  const accentColor = siteSettings.themeColors.primary;
  const cardBg = siteSettings.themeColors.cardBg;
  const textMuted = siteSettings.themeColors.textMuted;
  const borderCol = siteSettings.themeColors.border;

  return (
    <div style={{ backgroundColor: bgColor, minHeight: '100vh', paddingBottom: '6rem' }}>
      <SEOHead
        title={`Terms & Conditions | ${siteSettings.businessName}`}
        description={`Read the terms and conditions for booking a stay with ${siteSettings.businessName}.`}
      />

      <div style={{ backgroundColor: cardBg, color: textColor, borderBottom: `1px solid ${borderCol}` }} className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <span style={{ color: accentColor }} className="text-xs font-bold uppercase tracking-widest block mb-2">
            Legal
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">
            Terms & Conditions
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div style={{ backgroundColor: cardBg, borderColor: borderCol, borderRadius: siteSettings.themeBorderRadius === 'none' ? '0' : '1rem' }} className="p-8 border shadow-sm prose prose-sm max-w-none">
          <div style={{ color: textColor }}>
            <h2>1. Introduction</h2>
            <p style={{ color: textMuted }}>These terms and conditions govern your use of this website and your booking with {siteSettings.businessName}.</p>
            
            <h2>2. Bookings and Payments</h2>
            <p style={{ color: textMuted }}>All bookings are subject to availability and confirmation. A deposit or full payment may be required to secure your reservation.</p>

            <h2>3. House Rules</h2>
            <p style={{ color: textMuted }}>Guests are expected to respect the property, staff, and other guests. Noise restrictions and specific property rules apply.</p>

            <h2>4. Liability</h2>
            <p style={{ color: textMuted }}>{siteSettings.businessName} is not liable for any loss, damage, or injury sustained during your stay unless caused by our negligence.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
