import { ArrowRight, Waves, Tent, Sparkles, Flame, Music, Mountain, Calendar, MapPin, Compass, Star, BookOpen } from 'lucide-react';
import { Stay, StayPackage, Experience, BlogPost, SiteSettings, ServiceItem } from '../types';
import { StayCard } from '../components/StayCard';
import { PackageCard } from '../components/PackageCard';
import { ExperienceCard } from '../components/ExperienceCard';
import { BlogCard } from '../components/BlogCard';
import { QuickSearch } from '../components/QuickSearch';
import { WhyChooseUsStorySection } from '../components/WhyChooseUsStorySection';
import { ServicesFacilitiesSection } from '../components/ServicesFacilitiesSection';
import { SEOHead } from '../components/SEOHead';
import { useState, useMemo } from 'react';
import { buildWhatsAppUrl } from '../lib/whatsapp';

interface HomePageProps {
  onNavigate: (path: string, query?: string) => void;
  stays: Stay[];
  packages: StayPackage[];
  experiences: Experience[];
  services?: ServiceItem[];
  blogs?: BlogPost[];
  siteSettings: SiteSettings;
  onOpenBookingWithItem: (item?: Stay | StayPackage) => void;
}

export function HomePage({
  onNavigate,
  stays,
  packages,
  experiences,
  services = [],
  blogs = [],
  siteSettings,
  onOpenBookingWithItem,
}: HomePageProps) {
  
  const buildGeneralEnquiryWhatsAppMsg = () => {
    return `Hello ${siteSettings.businessName}! I want to check availability and know more about your property.`;
  };

  const whatsappUrl = buildWhatsAppUrl(
    siteSettings.whatsappNumber,
    buildGeneralEnquiryWhatsAppMsg()
  );

  const testimonials = [
    {
      id: 1,
      customerName: 'Rohit Sharma',
      location: 'Mumbai',
      rating: 5,
      review: 'Absolutely stunning location right by the water. The BBQ was excellent and the staff were very hospitable. Highly recommended for couples.',
      stayName: 'Glamping Dome',
    },
    {
      id: 2,
      customerName: 'Priya & Rahul',
      location: 'Pune',
      rating: 5,
      review: 'We booked the Triangle Cottage for our anniversary. The setup was beautiful, and the private balcony view in the morning was magical.',
      stayName: 'Triangle Cottage',
    },
    {
      id: 3,
      customerName: 'Aditya Desai',
      location: 'Navi Mumbai',
      rating: 4,
      review: 'Great place for a weekend getaway with friends. The live music and bonfire vibe was perfect. Tents were clean and comfortable.',
      stayName: 'Premium Lakeside Tent',
    },
  ];

  const featuredStays = useMemo(() => {
    return stays
      .filter((s) => s.status !== 'Inactive' && s.isFeatured)
      .sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999))
      .slice(0, siteSettings.featuredAccommodationMaxCards || 6);
  }, [stays, siteSettings.featuredAccommodationMaxCards]);

  const featuredPackages = useMemo(() => {
    return packages
      .filter((p) => p.status !== 'Inactive' && (p.isPopular || p.isFeatured))
      .sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999))
      .slice(0, siteSettings.popularPackagesMaxCards || 6);
  }, [packages, siteSettings.popularPackagesMaxCards]);

  const getFeaturedStaysBg = () => {
    switch (siteSettings.featuredAccommodationBgStyle) {
      case 'card': return cardBg;
      case 'dark': return '#051C12'; // or specific deep brand dark
      case 'transparent': return 'transparent';
      default: return bgColor;
    }
  };

  // Sort active sections
  const sectionsToRender = (siteSettings.homepageSections && siteSettings.homepageSections.length > 0)
    ? siteSettings.homepageSections
        .filter((sec) => sec.enabled !== false)
        .sort((a, b) => a.order - b.order)
    : [
        { id: 'hero', enabled: true },
        { id: 'bookingSearch', enabled: true },
        { id: 'whyChooseUs', enabled: true },
        { id: 'featuredStays', enabled: true },
        { id: 'packages', enabled: true },
        { id: 'experiences', enabled: true },
        { id: 'testimonials', enabled: true },
        { id: 'cta', enabled: true },
      ];

  const heroImage = (siteSettings.heroImages && siteSettings.heroImages.length > 0)
    ? siteSettings.heroImages[0]
    : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85";

  const handleQuickSearchSubmit = (guests: number, checkIn: string, category: string, checkOut?: string) => {
    const params = new URLSearchParams();
    params.set('guests', String(guests));
    params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (category) params.set('category', category);
    onNavigate('/stays', params.toString());
  };

  const bgColor = siteSettings.themeColors.background;
  const textColor = siteSettings.themeColors.text;
  const accentColor = siteSettings.themeColors.primary;
  const cardBg = siteSettings.themeColors.cardBg;
  const textMuted = siteSettings.themeColors.textMuted;
  const borderCol = siteSettings.themeColors.border;
  const radius = siteSettings.themeBorderRadius === 'none' ? '0' : siteSettings.themeBorderRadius === 'sm' ? '0.125rem' : siteSettings.themeBorderRadius === 'md' ? '0.375rem' : siteSettings.themeBorderRadius === 'lg' ? '0.5rem' : siteSettings.themeBorderRadius === 'xl' ? '0.75rem' : '1rem';

  return (
    <div style={{ backgroundColor: bgColor, color: textColor, minHeight: '100vh' }}>
      <SEOHead
        title={siteSettings.seoTitle || `${siteSettings.businessName} | Premium Stays & Experiences`}
        description={siteSettings.metaDescription || siteSettings.tagline}
        canonicalUrl="https://pawnastaycation.com"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'LodgingBusiness',
          name: siteSettings.businessName,
          description: siteSettings.tagline,
          address: {
            '@type': 'PostalAddress',
            streetAddress: siteSettings.locationAddress.replace(/\n/g, ', '),
            addressLocality: 'Lonavala',
            addressRegion: 'Maharashtra',
            addressCountry: 'IN',
          },
          telephone: siteSettings.phone,
        }}
      />

      {sectionsToRender.map((section) => {
        switch (section.id) {
          case 'hero':
            return (
              <section
                key="hero"
                className="w-full aspect-[16/9] relative flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: bgColor }}
                id="homepage-hero-section"
              >
                <div className="absolute inset-0 z-0">
                  <img
                    src={heroImage}
                    alt={siteSettings.businessName}
                    className="w-full h-full object-cover scale-105 transition-transform duration-1000 opacity-60"
                  />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${bgColor}, transparent, rgba(0,0,0,0.5))` }} />
                </div>

                <div className="relative z-10 w-full max-w-5xl mx-auto px-3 xs:px-4 sm:px-6 text-center py-2 sm:py-6 md:py-10 flex flex-col items-center justify-center h-full">
                  {/* Location badge */}
                  <div
                    style={{ backgroundColor: cardBg, borderColor: accentColor }}
                    className="inline-flex items-center gap-1 sm:gap-2 px-2 xs:px-2.5 sm:px-4 py-0.5 sm:py-1 rounded-sm border text-[7px] xs:text-[8px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.25em] font-medium mb-1 xs:mb-1.5 sm:mb-3 md:mb-5 shadow-lg"
                  >
                    <MapPin style={{ color: accentColor }} className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span style={{ color: accentColor }} className="truncate max-w-[200px] xs:max-w-[280px] sm:max-w-none">
                      📍 {siteSettings.locationAddress.replace(/\n/g, ', ')}
                    </span>
                  </div>
                  
                  {/* Hero heading */}
                  <h1
                    style={{ color: textColor }}
                    className="font-serif text-sm xs:text-base sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.1] mb-1 xs:mb-1.5 sm:mb-3 md:mb-4"
                  >
                    {siteSettings.heroHeading || siteSettings.businessName}
                  </h1>
                  
                  {/* Hero subtitle */}
                  <p
                    style={{ color: textMuted }}
                    className="max-w-xl mx-auto text-[8px] xs:text-[10px] sm:text-sm md:text-base font-sans leading-tight sm:leading-relaxed mb-1.5 xs:mb-2.5 sm:mb-5 md:mb-6 line-clamp-1 sm:line-clamp-2"
                  >
                    {siteSettings.heroSubheading || siteSettings.tagline}
                  </p>
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-row items-center justify-center gap-1.5 xs:gap-2 sm:gap-4">
                    <button
                      onClick={() => onNavigate('/stays')}
                      style={{ backgroundColor: accentColor, color: bgColor, borderRadius: radius }}
                      className="px-2.5 xs:px-3 sm:px-6 md:px-8 py-1 xs:py-1.5 sm:py-3 md:py-4 font-bold text-[7px] xs:text-[9px] sm:text-xs uppercase tracking-wider sm:tracking-widest shadow-md transition-all flex items-center justify-center gap-1 sm:gap-2 cursor-pointer active:scale-95"
                      id="hero-explore-stays-btn"
                    >
                      <Compass className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 fill-current shrink-0" />
                      <span>{siteSettings.heroPrimaryCtaText || 'Explore Stays'}</span>
                    </button>
                    <button
                      onClick={() => onOpenBookingWithItem()}
                      style={{ backgroundColor: 'transparent', color: textColor, borderColor: borderCol, borderRadius: radius }}
                      className="px-2.5 xs:px-3 sm:px-6 md:px-8 py-1 xs:py-1.5 sm:py-3 md:py-4 border hover:opacity-80 font-bold text-[7px] xs:text-[9px] sm:text-xs uppercase tracking-wider sm:tracking-widest shadow-md transition-all flex items-center justify-center gap-1 sm:gap-2 cursor-pointer active:scale-95"
                      id="hero-book-your-stay-btn"
                    >
                      <Calendar style={{ color: accentColor }} className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 shrink-0" />
                      <span>{siteSettings.heroSecondaryCtaText || 'Book Your Stay'}</span>
                    </button>
                  </div>
                </div>
              </section>
            );

          case 'bookingSearch':
            return (
              <section key="bookingSearch" className="px-4 sm:px-6 pt-6 pb-6 relative z-20 max-w-7xl mx-auto w-full" id="booking-search-section">
                <QuickSearch onSearch={handleQuickSearchSubmit} siteSettings={siteSettings} />
              </section>
            );

          case 'whyChooseUs':
            return (
              <WhyChooseUsStorySection
                key="whyChooseUs"
                siteSettings={siteSettings}
                onExploreStays={() => onNavigate('/stays')}
              />
            );

          case 'featuredStays':
            if (siteSettings.featuredAccommodationEnabled === false) return null;
            return (
              <section
                key="featuredStays"
                className="py-20 relative overflow-hidden"
                style={{
                  backgroundColor: getFeaturedStaysBg(),
                  borderTop: `1px solid ${borderCol}`,
                  borderBottom: `1px solid ${borderCol}`
                }}
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <div>
                      <span style={{ color: accentColor }} className="text-[10px] font-bold uppercase tracking-[0.3em] block mb-2">
                        HANDPICKED RETREATS
                      </span>
                      <h2 style={{ color: textColor }} className="font-serif text-3xl md:text-5xl font-light">
                        {siteSettings.featuredAccommodationTitle || 'Featured Accommodation'}
                      </h2>
                      {(siteSettings.featuredAccommodationSubtitle || siteSettings.featuredAccommodationDescription) && (
                        <p style={{ color: textMuted }} className="text-sm md:text-base mt-3 leading-relaxed max-w-2xl">
                          {siteSettings.featuredAccommodationSubtitle || siteSettings.featuredAccommodationDescription}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => onNavigate(siteSettings.featuredAccommodationCTALink || '/stays')}
                      style={{ color: accentColor, borderColor: accentColor }}
                      className="mt-4 md:mt-0 text-xs uppercase tracking-widest font-bold flex items-center gap-2 group cursor-pointer border-b pb-1 hover:opacity-80"
                    >
                      <span>{siteSettings.featuredAccommodationCTA || 'View All Options'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                  
                  {featuredStays.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {featuredStays.map((stay) => (
                        <StayCard
                          key={stay.id}
                          stay={stay}
                          onViewDetails={(slug) => onNavigate('/stay-details', `id=${slug}`)}
                          onBookNow={(s) => onOpenBookingWithItem(s)}
                          siteSettings={siteSettings}
                        />
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: textMuted }} className="text-center py-10 font-sans text-sm">
                      No featured accommodations selected. Select them from the Admin Portal.
                    </p>
                  )}
                </div>
              </section>
            );

          case 'services':
            return (
              <ServicesFacilitiesSection
                key="services"
                services={services}
                siteSettings={siteSettings}
                onOpenBookingModal={() => onOpenBookingWithItem()}
                isStandalonePage={false}
              />
            );

          case 'packages':
            if (siteSettings.popularPackagesEnabled === false) return null;
            return (
              <section key="packages" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-14">
                  <span style={{ color: accentColor }} className="text-[10px] font-bold uppercase tracking-[0.3em] block mb-2">
                    CURATED GETAWAYS
                  </span>
                  <h2 style={{ color: textColor }} className="font-serif text-3xl md:text-5xl font-light">
                    {siteSettings.popularPackagesTitle || 'Popular Stay Packages'}
                  </h2>
                  {(siteSettings.popularPackagesSubtitle || siteSettings.popularPackagesDescription) && (
                    <p style={{ color: textMuted }} className="text-sm md:text-base mt-3 leading-relaxed">
                      {siteSettings.popularPackagesSubtitle || siteSettings.popularPackagesDescription}
                    </p>
                  )}
                </div>
                
                {featuredPackages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {featuredPackages.map((pkg) => (
                      <PackageCard
                        key={pkg.id}
                        pkg={pkg}
                        onViewPackage={(slug) => onNavigate('/package-details', `id=${slug}`)}
                        onBookPackage={(p) => onOpenBookingWithItem(p)}
                        siteSettings={siteSettings}
                      />
                    ))}
                  </div>
                ) : (
                  <p style={{ color: textMuted }} className="text-center py-10 font-sans text-sm">
                    No packages selected. Select them from the Admin Portal.
                  </p>
                )}
                
                <div className="text-center mt-10">
                  <button
                    onClick={() => onNavigate(siteSettings.popularPackagesCTALink || '/packages')}
                    style={{ backgroundColor: accentColor, color: bgColor, borderRadius: radius }}
                    className="px-8 py-3.5 font-bold text-xs uppercase tracking-widest hover:opacity-90 shadow-lg transition-all cursor-pointer"
                  >
                    {siteSettings.popularPackagesCTA || 'Explore All Packages →'}
                  </button>
                </div>
              </section>
            );

          case 'experiences':
            const displayBlogs = (blogs.length > 0 ? blogs : [])
              .filter((b) => b.status !== 'Draft')
              .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
              .slice(0, 6);

            return (
              <section key="experiences" id="travel-stories-section" className="py-20" style={{ borderTop: `1px solid ${borderCol}`, borderBottom: `1px solid ${borderCol}` }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center max-w-3xl mx-auto mb-14">
                    <span style={{ color: accentColor }} className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] block mb-2">
                      TRAVEL INSPIRATION
                    </span>
                    <h2 style={{ color: textColor }} className="font-serif text-3xl md:text-5xl font-light tracking-tight">
                      Stories from Pawna
                    </h2>
                    <p style={{ color: textMuted }} className="text-sm md:text-base mt-3 leading-relaxed font-sans">
                      Discover Pawna Lake, plan your perfect getaway and get inspired for your next escape.
                    </p>
                  </div>
                  
                  {displayBlogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {displayBlogs.map((blog) => (
                        <BlogCard
                          key={blog.id}
                          blog={blog}
                          onReadStory={(slug) => onNavigate('/blog-detail', `id=${slug}`)}
                          siteSettings={siteSettings}
                        />
                      ))}
                    </div>
                  ) : null}

                  <div className="text-center mt-12">
                    <button
                      onClick={() => onNavigate('/blog')}
                      style={{ backgroundColor: accentColor, color: bgColor, borderRadius: radius }}
                      className="px-8 py-3.5 font-bold text-xs uppercase tracking-widest hover:opacity-90 shadow-lg transition-all cursor-pointer inline-flex items-center gap-2 group"
                    >
                      <span>View All Stories</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </section>
            );

          case 'testimonials':
            return (
              <section key="testimonials" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-14">
                  <span style={{ color: accentColor }} className="text-[10px] font-bold uppercase tracking-[0.3em] block mb-2">
                    Verified Experiences
                  </span>
                  <h2 style={{ color: textColor }} className="font-serif text-3xl md:text-5xl font-light">
                    What Our Guests Say
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {testimonials.map((rev) => (
                    <div
                      key={rev.id}
                      style={{ backgroundColor: cardBg, borderColor: borderCol, borderRadius: radius }}
                      className="p-6 border shadow-lg flex flex-col justify-between"
                    >
                      <div>
                        <div style={{ color: accentColor }} className="flex items-center gap-1 mb-3">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} style={{ fill: accentColor }} className="w-4 h-4" />
                          ))}
                        </div>
                        <p style={{ color: textMuted }} className="text-xs italic leading-relaxed mb-4">"{rev.review}"</p>
                      </div>
                      <div className="pt-4 flex items-center justify-between" style={{ borderTop: `1px solid ${borderCol}` }}>
                        <div>
                          <p style={{ color: textColor }} className="text-sm font-bold">{rev.customerName}</p>
                          <p style={{ color: textMuted }} className="text-[10px]">{rev.location}</p>
                        </div>
                        {rev.stayName && (
                          <span style={{ backgroundColor: bgColor, color: accentColor, borderColor: borderCol }} className="text-[10px] px-2 py-1 rounded border">
                            {rev.stayName.split(' ')[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );

          case 'cta':
            return (
              <section key="cta" className="py-16 relative overflow-hidden" style={{ borderTop: `1px solid ${borderCol}` }}>
                <div className="absolute inset-0 bg-gradient-to-t" style={{ backgroundImage: `linear-gradient(to right, ${bgColor}, ${cardBg}, ${bgColor})` }} />
                <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-6">
                  <span style={{ color: accentColor, borderColor: accentColor }} className="px-3 py-1 rounded-sm border text-[10px] font-bold uppercase tracking-[0.3em] inline-block">
                    Ready for a Getaway?
                  </span>
                  <h2 style={{ color: textColor }} className="font-serif text-3xl sm:text-5xl font-light leading-tight">
                    Plan Your {siteSettings.businessName} Escape Today
                  </h2>
                  <p style={{ color: textMuted }} className="text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                    Contact our reservation team on WhatsApp to check live availability, request custom setups or group packages.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-8 py-4 rounded-sm bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2"
                      id="cta-banner-whatsapp-btn"
                    >
                      <span>Enquire on WhatsApp</span>
                    </a>
                    <button
                      onClick={() => onOpenBookingWithItem()}
                      style={{ backgroundColor: accentColor, color: bgColor, borderRadius: radius }}
                      className="w-full sm:w-auto px-8 py-4 font-bold text-xs uppercase tracking-widest hover:opacity-90 shadow-xl transition-all"
                      id="cta-banner-check-avail-btn"
                    >
                      Check Availability Online
                    </button>
                  </div>
                </div>
              </section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
