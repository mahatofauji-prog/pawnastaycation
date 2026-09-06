import { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { Stay, SiteSettings } from '../types';
import { StayCard } from '../components/StayCard';
import { SEOHead } from '../components/SEOHead';

interface StaysPageProps {
  stays: Stay[];
  siteSettings: SiteSettings;
  onNavigate: (path: string, query?: string) => void;
  onOpenBookingWithItem?: (item: any) => void;
}

type SortOption = 'recommended' | 'price_low' | 'price_high' | 'popular';

export function StaysPage({ stays, siteSettings, onNavigate, onOpenBookingWithItem }: StaysPageProps) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    stayType: 'All',
    lakeViewOnly: false,
    coupleFriendlyOnly: false,
    familyFriendlyOnly: false,
    privateOnly: false,
    sortBy: 'recommended' as SortOption,
    selectedAmenities: [] as string[],
  });

  const availableAmenities = useMemo(() => {
    const ams = new Set<string>();
    stays.forEach((s) => s.amenities.forEach((a) => ams.add(a)));
    return Array.from(ams).sort();
  }, [stays]);

  const toggleAmenity = (amenity: string) => {
    setFilters((prev) => {
      const current = prev.selectedAmenities || [];
      const updated = current.includes(amenity)
        ? current.filter((a) => a !== amenity)
        : [...current, amenity];
      return { ...prev, selectedAmenities: updated };
    });
  };

  const resetFilters = () => {
    setFilters({
      stayType: 'All',
      lakeViewOnly: false,
      coupleFriendlyOnly: false,
      familyFriendlyOnly: false,
      privateOnly: false,
      sortBy: 'recommended',
      selectedAmenities: [],
    });
  };

  const filteredStays = useMemo(() => {
    let result = [...stays];

    if (filters.stayType !== 'All') {
      result = result.filter((s) => s.type === filters.stayType || (filters.stayType === 'Cottage' && s.type.includes('Cottage')));
    }
    if (filters.lakeViewOnly) {
      result = result.filter((s) => s.isLakeView);
    }
    if (filters.coupleFriendlyOnly) {
      result = result.filter((s) => s.isCoupleFriendly);
    }
    if (filters.familyFriendlyOnly) {
      result = result.filter((s) => s.isFamilyFriendly);
    }
    if (filters.privateOnly) {
      result = result.filter((s) => s.isPrivate);
    }
    if (filters.selectedAmenities && filters.selectedAmenities.length > 0) {
      result = result.filter((s) =>
        filters.selectedAmenities.every((a) => s.amenities.includes(a))
      );
    }

    if (filters.sortBy === 'price_low') {
      result.sort((a, b) => (a.price.amount || 0) - (b.price.amount || 0));
    } else if (filters.sortBy === 'price_high') {
      result.sort((a, b) => (b.price.amount || 0) - (a.price.amount || 0));
    } else if (filters.sortBy === 'popular') {
      result.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
    } else {
      result.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
    }

    return result;
  }, [stays, filters]);

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
        title={`All Stays & Accommodations | ${siteSettings.businessName}`}
        description={`Explore our premium stays at ${siteSettings.businessName}.`}
      />

      <div style={{ backgroundColor: cardBg, color: textColor, borderBottom: `1px solid ${borderCol}` }} className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <span style={{ color: accentColor }} className="text-xs font-bold uppercase tracking-widest block mb-2">
            Accommodations
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">
            Explore All Stays
          </h1>
          <p style={{ color: textMuted }} className="text-sm sm:text-base max-w-2xl mx-auto mt-3">
            Find your perfect escape from our collection of handpicked properties.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Mobile Filter Toggle & Sort Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span style={{ color: textColor }} className="font-serif text-xl font-bold">
              Available Stays ({filteredStays.length})
            </span>
          </div>
          <div className="flex items-center gap-3 justify-between md:justify-end">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              style={{ backgroundColor: cardBg, color: textColor, borderColor: borderCol }}
              className="lg:hidden px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 border"
            >
              <Filter style={{ color: accentColor }} className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2">
              <span style={{ color: textMuted }} className="text-xs font-semibold whitespace-nowrap">Sort By:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                style={{ backgroundColor: cardBg, color: accentColor, borderColor: borderCol }}
                className="border rounded-xl py-2 px-3 text-xs font-bold focus:ring-2 focus:outline-none"
              >
                <option value="recommended">Recommended</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* DESKTOP SIDEBAR FILTERS */}
          <div style={{ backgroundColor: cardBg, borderColor: borderCol, borderRadius: radius }} className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} space-y-6 p-6 border shadow-xl h-fit sticky top-24`}>
            <div className="flex items-center justify-between pb-4" style={{ borderBottomColor: borderCol, borderBottomWidth: '1px' }}>
              <div style={{ color: textColor }} className="flex items-center gap-2 font-bold text-base">
                <SlidersHorizontal style={{ color: accentColor }} className="w-4 h-4" />
                <span>Filter Stays</span>
              </div>
              <button
                onClick={resetFilters}
                style={{ color: accentColor }}
                className="text-xs font-semibold hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Stay Type */}
            <div className="space-y-2">
              <label style={{ color: textMuted }} className="text-xs font-bold uppercase tracking-wider">Stay Type</label>
              <div className="space-y-1.5">
                {['All', 'Glamping Tent', 'Cottage', 'Camping', 'Villa / Suite'].map((type) => (
                  <label key={type} style={{ color: textColor }} className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="stayType"
                      checked={filters.stayType === type}
                      onChange={() => setFilters({ ...filters, stayType: type })}
                      className="focus:ring-2"
                    />
                    <span>{type === 'All' ? 'All Types' : type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Quick Checkboxes */}
            <div className="space-y-2 pt-4" style={{ borderTopColor: borderCol, borderTopWidth: '1px' }}>
              <label style={{ color: textMuted }} className="text-xs font-bold uppercase tracking-wider">Preference Badges</label>
              <div style={{ color: textColor }} className="space-y-2 text-xs font-medium">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.lakeViewOnly}
                    onChange={(e) => setFilters({ ...filters, lakeViewOnly: e.target.checked })}
                    className="rounded focus:ring-2"
                  />
                  <span>🌊 View Included</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.coupleFriendlyOnly}
                    onChange={(e) => setFilters({ ...filters, coupleFriendlyOnly: e.target.checked })}
                    className="rounded focus:ring-2"
                  />
                  <span>👩‍❤️‍👨 Couple Friendly</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.familyFriendlyOnly}
                    onChange={(e) => setFilters({ ...filters, familyFriendlyOnly: e.target.checked })}
                    className="rounded focus:ring-2"
                  />
                  <span>👨‍👩‍👧 Family Friendly</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.privateOnly}
                    onChange={(e) => setFilters({ ...filters, privateOnly: e.target.checked })}
                    className="rounded focus:ring-2"
                  />
                  <span>🏡 Private Amenities</span>
                </label>
              </div>
            </div>

            {/* Amenities Checklist */}
            <div className="space-y-2 pt-4" style={{ borderTopColor: borderCol, borderTopWidth: '1px' }}>
              <label style={{ color: textMuted }} className="text-xs font-bold uppercase tracking-wider">Amenities</label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {availableAmenities.map((amenity) => {
                  const isChecked = filters.selectedAmenities?.includes(amenity);
                  return (
                    <label key={amenity} style={{ color: textColor }} className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleAmenity(amenity)}
                        className="rounded focus:ring-2"
                      />
                      <span>{amenity}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ACCOMMODATION CARDS GRID */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <p style={{ color: textMuted }} className="text-xs font-semibold">
                Showing <strong>{filteredStays.length}</strong> stays
              </p>
            </div>

            {filteredStays.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredStays.map((stay) => (
                  <StayCard
                    key={stay.id}
                    stay={stay}
                    onViewDetails={(slug) => onNavigate('/stay-details', `id=${slug}`)}
                    onBookNow={onOpenBookingWithItem ? (s) => onOpenBookingWithItem(s) : undefined}
                    siteSettings={siteSettings}
                  />
                ))}
              </div>
            ) : (
              /* EMPTY STATE */
              <div style={{ backgroundColor: cardBg, borderColor: borderCol, borderRadius: radius }} className="p-12 text-center border shadow-sm space-y-4">
                <div style={{ backgroundColor: accentColor, color: bgColor }} className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  ⛺
                </div>
                <h3 style={{ color: textColor }} className="font-serif text-xl font-bold">No exact stay match found</h3>
                <p style={{ color: textMuted }} className="text-xs max-w-md mx-auto">
                  Try adjusting your filter criteria or view all accommodations.
                </p>
                <button
                  onClick={resetFilters}
                  style={{ backgroundColor: accentColor, color: bgColor, borderRadius: radius }}
                  className="px-6 py-2.5 text-xs font-bold shadow"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
