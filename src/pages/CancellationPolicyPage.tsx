import { SiteSettings } from '../types';
import { SEOHead } from '../components/SEOHead';

interface CancellationPolicyPageProps {
  siteSettings: SiteSettings;
}

export function CancellationPolicyPage({ siteSettings }: CancellationPolicyPageProps) {
  const bgColor = siteSettings.themeColors.background;
  const textColor = siteSettings.themeColors.text;
  const accentColor = siteSettings.themeColors.primary;
  const cardBg = siteSettings.themeColors.cardBg;
  const textMuted = siteSettings.themeColors.textMuted;
  const borderCol = siteSettings.themeColors.border;

  return (
    <div style={{ backgroundColor: bgColor, minHeight: '100vh', paddingBottom: '6rem' }}>
      <SEOHead
        title={`Cancellation & Refund Policy | ${siteSettings.businessName}`}
        description={`Read the cancellation and refund policy for ${siteSettings.businessName}.`}
      />
      <div style={{ backgroundColor: cardBg, color: textColor, borderBottom: `1px solid ${borderCol}` }} className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <span style={{ color: accentColor }} className="text-xs font-bold uppercase tracking-widest block mb-2">
            Policies
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">
            Cancellation Policy
          </h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div style={{ backgroundColor: cardBg, borderColor: borderCol, borderRadius: siteSettings.themeBorderRadius === 'none' ? '0' : '1rem' }} className="p-8 border shadow-sm prose prose-sm max-w-none">
          <div style={{ color: textColor }}>
            <p style={{ color: textMuted }}>At {siteSettings.businessName}, we strive to provide a flexible and fair cancellation policy.</p>
            <h2>General Cancellation</h2>
            <p style={{ color: textMuted }}>Cancellations made 7 or more days prior to the check-in date will receive a full refund (minus any payment processing fees).</p>
            <h2>Late Cancellations</h2>
            <p style={{ color: textMuted }}>Cancellations made within 7 days of the check-in date may be subject to a cancellation fee or partial refund.</p>
            <h2>No Shows</h2>
            <p style={{ color: textMuted }}>Failure to arrive on the check-in date without prior notice will result in the forfeiture of the booking amount.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
