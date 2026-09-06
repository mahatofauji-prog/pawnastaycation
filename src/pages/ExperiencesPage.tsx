import { Experience, SiteSettings } from '../types';
import { ExperienceCard } from '../components/ExperienceCard';
import { SEOHead } from '../components/SEOHead';

interface ExperiencesPageProps {
  experiences: Experience[];
  siteSettings: SiteSettings;
  onOpenBooking: () => void;
}

export function ExperiencesPage({
  experiences,
  siteSettings,
  onOpenBooking,
}: ExperiencesPageProps) {
  const bgColor = siteSettings.themeColors.background;
  const textColor = siteSettings.themeColors.text;
  const accentColor = siteSettings.themeColors.primary;
  const cardBg = siteSettings.themeColors.cardBg;
  const textMuted = siteSettings.themeColors.textMuted;
  const borderCol = siteSettings.themeColors.border;

  return (
    <div style={{ backgroundColor: bgColor, minHeight: '100vh', paddingBottom: '6rem' }}>
      <SEOHead
        title={`Experiences & Activities | ${siteSettings.businessName}`}
        description={`Discover outdoor experiences at ${siteSettings.businessName}.`}
      />

      <div style={{ backgroundColor: cardBg, color: textColor, borderBottom: `1px solid ${borderCol}` }} className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <span style={{ color: accentColor }} className="text-xs font-bold uppercase tracking-widest block mb-2">
            Moments
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">
            Outdoor Experiences
          </h1>
          <p style={{ color: textMuted }} className="text-sm sm:text-base max-w-2xl mx-auto mt-3">
            Every staycation includes curated experiences designed to help you reconnect with nature, family, and friends.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((exp) => (
            <ExperienceCard
              key={exp.id}
              experience={exp}
              onEnquireExperience={() => onOpenBooking()}
              siteSettings={siteSettings}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
