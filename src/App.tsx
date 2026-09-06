import { useState, useEffect } from 'react';
import { api } from './lib/api';
import { Stay, StayPackage, Experience, GalleryItem, FAQItem, Testimonial, BlogPost, SiteSettings, ServiceItem } from './types';

// Global Layout Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingControls } from './components/FloatingControls';
import { BookingWizardModal } from './components/BookingWizardModal';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { StaysPage } from './pages/StaysPage';
import { StayDetailPage } from './pages/StayDetailPage';
import { PackagesPage } from './pages/PackagesPage';
import { PackageDetailPage } from './pages/PackageDetailPage';
import { ExperiencesPage } from './pages/ExperiencesPage';
import { ServicesPage } from './pages/ServicesPage';
import { GalleryPage } from './pages/GalleryPage';
import { LocationPage } from './pages/LocationPage';
import { FAQsPage } from './pages/FAQsPage';
import { ContactPage } from './pages/ContactPage';
import { BookingPage } from './pages/BookingPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { CancellationPolicyPage } from './pages/CancellationPolicyPage';
import { BlogListPage } from './pages/BlogListPage';
import { BlogDetailPage } from './pages/BlogDetailPage';

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');
  const [queryParam, setQueryParam] = useState<string>(window.location.search || '');

  // Master Data state
  const [stays, setStays] = useState<Stay[]>([]);
  const [packages, setPackages] = useState<StayPackage[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [preselectedBookingItem, setPreselectedBookingItem] = useState<Stay | StayPackage | null>(null);

  // Load all initial data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setQueryParam(window.location.search || '');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const loadAllData = async () => {
    try {
      const [s, p, e, srv, g, f, t, b, settings] = await Promise.all([
        api.getStays(),
        api.getPackages(),
        api.getExperiences(),
        api.getServices(),
        api.getGallery(),
        api.getFaqs(),
        api.getTestimonials(),
        api.getBlogs(),
        api.getSiteSettings(),
      ]);

      setStays(s);
      setPackages(p);
      setExperiences(e);
      setServices(srv);
      setGallery(g);
      setFaqs(f);
      setTestimonials(t);
      setBlogs(b);
      setSiteSettings(settings);
    } catch (err) {
      console.error('Error fetching site data:', err);
    } finally {
      setLoading(false);
    }
  };

  const navigate = (path: string, query: string = '') => {
    // Check if path is like /blog/slug or blog-detail
    let targetPath = path;
    let targetQuery = query;

    if (path.startsWith('/')) {
      targetPath = path;
    } else if (path === 'blog-detail') {
      targetPath = '/blog-detail';
      targetQuery = query ? (query.startsWith('id=') ? query : `id=${query}`) : '';
    } else if (path === 'blog') {
      targetPath = '/blog';
    } else {
      targetPath = `/${path}`;
    }

    setCurrentPath(targetPath);
    setQueryParam(targetQuery ? `?${targetQuery}` : '');
    const newUrl = targetQuery ? `${targetPath}?${targetQuery}` : targetPath;
    window.history.pushState({}, '', newUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBookingModal = (item?: Stay | StayPackage) => {
    if (item) {
      setPreselectedBookingItem(item);
    } else {
      setPreselectedBookingItem(null);
    }
    setBookingModalOpen(true);
  };

  if (loading || !siteSettings) {
    return (
      <div className="min-h-screen bg-[#14291D] text-[#FAF8F5] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#C5A059] border-t-transparent animate-spin mb-4" />
        <h2 className="font-serif text-2xl font-bold tracking-wide">Pawnastaycation</h2>
        <p className="text-xs text-[#EADBC8] mt-1 font-sans">Loading luxury Pawna Lake experiences...</p>
      </div>
    );
  }

  // Parse details query params if applicable
  const searchParams = new URLSearchParams(queryParam);
  const detailId = searchParams.get('id') || (currentPath.startsWith('/blog/') ? currentPath.replace('/blog/', '') : '');

  // Page Routing Logic
  const renderCurrentPage = () => {
    // Normalize path: strip trailing slash except for root '/'
    const cleanPath = (currentPath.length > 1 && currentPath.endsWith('/'))
      ? currentPath.replace(/\/+$/, '')
      : currentPath;

    // Check dynamic /stays/:id or /stay/:id route
    const stayMatch = cleanPath.match(/^\/(?:stays|stay)\/([^/]+)/i);
    if (stayMatch) {
      const stayIdOrSlug = decodeURIComponent(stayMatch[1]);
      const selectedStay =
        stays.find((s) => s.slug === stayIdOrSlug || s.id === stayIdOrSlug) ||
        stays.find((s) => s.slug.toLowerCase() === stayIdOrSlug.toLowerCase() || s.id.toLowerCase() === stayIdOrSlug.toLowerCase()) ||
        stays[0];
      return (
        <StayDetailPage
          stay={selectedStay}
          onNavigate={navigate}
          siteSettings={siteSettings}
          onOpenBookingWithItem={handleOpenBookingModal}
          allFaqs={faqs}
        />
      );
    }

    // Check dynamic /packages/:id or /package/:id route
    const pkgMatch = cleanPath.match(/^\/(?:packages|package)\/([^/]+)/i);
    if (pkgMatch) {
      const pkgIdOrSlug = decodeURIComponent(pkgMatch[1]);
      const selectedPkg =
        packages.find((p) => p.slug === pkgIdOrSlug || p.id === pkgIdOrSlug) ||
        packages.find((p) => p.slug.toLowerCase() === pkgIdOrSlug.toLowerCase() || p.id.toLowerCase() === pkgIdOrSlug.toLowerCase()) ||
        packages[0];
      return (
        <PackageDetailPage
          pkg={selectedPkg}
          onNavigate={navigate}
          siteSettings={siteSettings}
          onOpenBookingWithItem={handleOpenBookingModal}
        />
      );
    }

    // Check dynamic /blog/:slug or /blogs/:slug route
    const blogMatch = cleanPath.match(/^\/(?:blog|blogs|story|stories)\/([^/]+)/i);
    if (blogMatch && blogMatch[1] !== 'detail' && blogMatch[1] !== 'details') {
      const slug = decodeURIComponent(blogMatch[1]);
      return (
        <BlogDetailPage
          slugOrId={slug}
          blogs={blogs}
          stays={stays}
          siteSettings={siteSettings}
          onNavigate={navigate}
          onOpenBookingModal={handleOpenBookingModal}
        />
      );
    }

    switch (cleanPath) {
      case '/':
      case '/home':
        return (
          <HomePage
            onNavigate={navigate}
            stays={stays}
            packages={packages}
            experiences={experiences}
            services={services}
            blogs={blogs}
            siteSettings={siteSettings}
            onOpenBookingWithItem={handleOpenBookingModal}
          />
        );

      case '/services':
      case '/facilities':
        return (
          <ServicesPage
            services={services}
            siteSettings={siteSettings}
            onOpenBookingWithItem={(name, id) => {
              if (name || id) {
                const found = stays.find((s) => s.name === name || s.id === id) || packages.find((p) => p.name === name || p.id === id);
                handleOpenBookingModal(found as any);
              } else {
                handleOpenBookingModal();
              }
            }}
          />
        );

      case '/about':
      case '/about-us':
        return <AboutPage siteSettings={siteSettings} onNavigate={navigate} />;

      case '/stays':
      case '/accommodations':
        return (
          <StaysPage
            onNavigate={navigate}
            stays={stays}
            siteSettings={siteSettings}
            onOpenBookingWithItem={handleOpenBookingModal}
          />
        );

      case '/stay-details':
      case '/stay-detail': {
        const selectedStay =
          stays.find((s) => s.slug === detailId || s.id === detailId) ||
          stays.find((s) => s.slug.toLowerCase() === (detailId || '').toLowerCase() || s.id.toLowerCase() === (detailId || '').toLowerCase()) ||
          stays[0];
        return (
          <StayDetailPage
            stay={selectedStay}
            onNavigate={navigate}
            siteSettings={siteSettings}
            onOpenBookingWithItem={handleOpenBookingModal}
            allFaqs={faqs}
          />
        );
      }

      case '/packages':
      case '/stay-packages':
        return (
          <PackagesPage
            onNavigate={navigate}
            packages={packages}
            siteSettings={siteSettings}
            onOpenBookingWithItem={handleOpenBookingModal}
          />
        );

      case '/package-details':
      case '/package-detail': {
        const selectedPkg =
          packages.find((p) => p.slug === detailId || p.id === detailId) ||
          packages.find((p) => p.slug.toLowerCase() === (detailId || '').toLowerCase() || p.id.toLowerCase() === (detailId || '').toLowerCase()) ||
          packages[0];
        return (
          <PackageDetailPage
            pkg={selectedPkg}
            onNavigate={navigate}
            siteSettings={siteSettings}
            onOpenBookingWithItem={handleOpenBookingModal}
          />
        );
      }

      case '/experiences':
      case '/activities':
        return (
          <ExperiencesPage
            experiences={experiences}
            siteSettings={siteSettings}
            onOpenBooking={() => handleOpenBookingModal()}
          />
        );

      case '/blog':
      case '/blogs':
      case '/stories':
        return (
          <BlogListPage
            blogs={blogs}
            siteSettings={siteSettings}
            onNavigate={navigate}
          />
        );

      case '/blog-detail':
      case '/blog-details':
      case '/story':
        return (
          <BlogDetailPage
            slugOrId={detailId || ''}
            blogs={blogs}
            stays={stays}
            siteSettings={siteSettings}
            onNavigate={navigate}
            onOpenBookingModal={handleOpenBookingModal}
          />
        );

      case '/gallery':
      case '/photos':
        return <GalleryPage siteSettings={siteSettings} gallery={gallery} />;

      case '/location':
      case '/reach-us':
      case '/directions':
        return <LocationPage siteSettings={siteSettings} />;

      case '/faq':
      case '/faqs':
        return <FAQsPage faqs={faqs} siteSettings={siteSettings} onNavigate={navigate} />;

      case '/contact':
      case '/contact-us':
        return (
          <ContactPage
            siteSettings={siteSettings}
            stays={stays}
            packages={packages}
            onNavigate={navigate}
          />
        );

      case '/booking':
      case '/book':
      case '/book-now':
        return (
          <BookingPage
            stays={stays}
            packages={packages}
            siteSettings={siteSettings}
          />
        );

      case '/terms':
      case '/terms-and-conditions':
        return <TermsPage siteSettings={siteSettings} />;

      case '/privacy':
      case '/privacy-policy':
        return <PrivacyPage siteSettings={siteSettings} />;

      case '/cancellation-policy':
      case '/cancellation':
        return <CancellationPolicyPage siteSettings={siteSettings} />;

      case '/admin':
      case '/cms':
        // Redirect to homepage
        setTimeout(() => {
          window.history.replaceState({}, '', '/');
          setCurrentPath('/');
        }, 0);
        return null;

      default:
        return (
          <HomePage
            onNavigate={navigate}
            stays={stays}
            packages={packages}
            experiences={experiences}
            services={services}
            blogs={blogs}
            siteSettings={siteSettings}
            onOpenBookingWithItem={handleOpenBookingModal}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F1715] text-[#F5F2ED] font-sans antialiased">
      {/* Header */}
      <Header
        currentPath={currentPath}
        onNavigate={navigate}
        siteSettings={siteSettings}
        onOpenBooking={() => handleOpenBookingModal()}
      />

      {/* Main Page View */}
      <main className="flex-1">{renderCurrentPage()}</main>

      {/* Sticky Floating Controls (WhatsApp + Book Now CTA) */}
      <FloatingControls
        siteSettings={siteSettings}
        onOpenBooking={() => handleOpenBookingModal()}
      />

      {/* Global Booking & Enquiry Wizard Modal */}
      <BookingWizardModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        stays={stays}
        packages={packages}
        siteSettings={siteSettings}
        preselectedItem={preselectedBookingItem}
      />

      {/* Footer */}
      <Footer
        siteSettings={siteSettings}
        onNavigate={navigate}
        onOpenBooking={() => handleOpenBookingModal()}
      />
    </div>
  );
}
