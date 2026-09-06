import { SiteSettings } from '../types';
import { SEOHead } from '../components/SEOHead';

interface PrivacyPageProps {
  siteSettings: SiteSettings;
}

export function PrivacyPage({ siteSettings }: PrivacyPageProps) {
  const bgColor = siteSettings.themeColors.background;
  const textColor = siteSettings.themeColors.text;
  const accentColor = siteSettings.themeColors.primary;
  const cardBg = siteSettings.themeColors.cardBg;
  const textMuted = siteSettings.themeColors.textMuted;
  const borderCol = siteSettings.themeColors.border;

  return (
    <div style={{ backgroundColor: bgColor, minHeight: '100vh', paddingBottom: '6rem' }}>
      <SEOHead
        title={`Privacy Policy | ${siteSettings.businessName}`}
        description={`Read the privacy policy for ${siteSettings.businessName}.`}
      />
      <div style={{ backgroundColor: cardBg, color: textColor, borderBottom: `1px solid ${borderCol}` }} className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <span style={{ color: accentColor }} className="text-xs font-bold uppercase tracking-widest block mb-2">
            Legal
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">
            Privacy Policy
          </h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div style={{ backgroundColor: cardBg, borderColor: borderCol, borderRadius: siteSettings.themeBorderRadius === 'none' ? '0' : '1rem' }} className="p-8 border shadow-sm prose prose-sm max-w-none">
          <div style={{ color: textColor }}>
            <p style={{ color: textMuted }}>Your privacy is important to {siteSettings.businessName}. This privacy statement provides information about the personal information that we collect, and the ways in which we use that personal information.</p>
            <h2>Personal Information Collection</h2>
            <p style={{ color: textMuted }}>We may collect and use personal information that you provide to us when booking, making an enquiry, or using our website.</p>
            <h2>Using Personal Information</h2>
            <p style={{ color: textMuted }}>We use your personal information to administer our business, process your bookings, and provide customer support.</p>
            <h2>Data Security</h2>
            <p style={{ color: textMuted }}>We take reasonable technical and organizational precautions to prevent the loss, misuse, or alteration of your personal information.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
