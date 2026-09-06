import { useState, useMemo } from 'react';
import { Sparkles, Calendar, Clock, Check } from 'lucide-react';
import { StayPackage, SiteSettings } from '../types';
import { PackageCard } from '../components/PackageCard';
import { SEOHead } from '../components/SEOHead';

interface PackagesPageProps {
  onNavigate: (path: string, query?: string) => void;
  packages: StayPackage[];
  siteSettings: SiteSettings;
  onOpenBookingWithItem: (item?: StayPackage) => void;
}

export function PackagesPage({
  onNavigate,
  packages,
  siteSettings,
  onOpenBookingWithItem,
}: PackagesPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = new Set<string>();
    packages.forEach(p => cats.add(p.category));
    return ['All', ...Array.from(cats).sort()];
  }, [packages]);

  const filteredPackages =
    selectedCategory === 'All'
      ? packages
      : packages.filter((p) => p.category === selectedCategory);

  const bgColor = siteSettings.themeColors.background;
  const textColor = siteSettings.themeColors.text;
  const accentColor = siteSettings.themeColors.primary;
  const cardBg = siteSettings.themeColors.cardBg;
  const textMuted = siteSettings.themeColors.textMuted;
  const borderCol = siteSettings.themeColors.border;

  return (
    <div style={{ backgroundColor: bgColor, minHeight: '100vh', paddingBottom: '6rem' }}>
      <SEOHead
        title={`Staycation Packages | ${siteSettings.businessName}`}
        description={`Explore all-inclusive packages at ${siteSettings.businessName}.`}
      />

      {/* Header */}
      <div style={{ backgroundColor: cardBg, color: textColor, borderBottom: `1px solid ${borderCol}` }} className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <span style={{ color: accentColor }} className="text-xs font-bold uppercase tracking-widest block mb-2">
            Curated Experiences
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">
            Staycation Packages
          </h1>
          <p style={{ color: textMuted }} className="text-sm sm:text-base max-w-2xl mx-auto mt-3">
            All-inclusive packages featuring accommodations, meals, and activities.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                backgroundColor: selectedCategory === cat ? cardBg : bgColor,
                color: selectedCategory === cat ? textColor : textMuted,
                borderColor: selectedCategory === cat ? accentColor : borderCol,
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${selectedCategory === cat ? 'shadow-md' : 'hover:opacity-80'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Package Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              onViewPackage={(slug) => onNavigate('/package-details', `id=${slug}`)}
              onBookPackage={(p) => onOpenBookingWithItem(p)}
              siteSettings={siteSettings}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
