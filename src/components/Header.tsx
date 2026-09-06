import { useState, useEffect } from 'react';
import { Menu, X, Phone, Calendar, Tent, MessageCircle } from 'lucide-react';
import { SiteSettings } from '../types';
import { buildWhatsAppUrl, buildGeneralEnquiryWhatsAppMsg } from '../lib/whatsapp';

interface HeaderProps {
  onNavigate: (path: string) => void;
  currentPath: string;
  onOpenBooking: () => void;
  siteSettings: SiteSettings;
}

export function Header({
  onNavigate,
  currentPath,
  onOpenBooking,
  siteSettings,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Accommodations', path: '/stays' },
    { name: 'Services', path: '/services' },
    { name: 'Packages', path: '/packages' },
    { name: 'Stories', path: '/blog' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const bgColor = siteSettings.themeColors.background;
  const textColor = siteSettings.themeColors.text;
  const accentColor = siteSettings.themeColors.primary;
  const cardBg = siteSettings.themeColors.cardBg;
  const borderCol = siteSettings.themeColors.border;
  const radius = siteSettings.themeBorderRadius === 'none' ? '0' : siteSettings.themeBorderRadius === 'sm' ? '0.125rem' : siteSettings.themeBorderRadius === 'md' ? '0.375rem' : siteSettings.themeBorderRadius === 'lg' ? '0.5rem' : siteSettings.themeBorderRadius === 'xl' ? '0.75rem' : '1rem';

  const phoneNum = siteSettings.phone || '+91 8793020527';
  const phoneClean = phoneNum.replace(/[^0-9+]/g, '');
  const whatsappUrl = buildWhatsAppUrl(siteSettings.whatsappNumber, buildGeneralEnquiryWhatsAppMsg());

  return (
    <>
      {siteSettings.announcementText && (
        <div style={{ backgroundColor: cardBg, color: textColor, borderBottom: `1px solid ${borderCol}` }} className="py-1.5 px-4 text-[10px] sm:text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2">
          <span>{siteSettings.announcementText}</span>
        </div>
      )}

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'shadow-2xl py-3' : 'py-4'}`}
        style={{ backgroundColor: isScrolled ? cardBg : bgColor, borderBottom: `1px solid ${borderCol}` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button onClick={() => handleNavClick('/')} className="flex items-center gap-2.5 text-left group focus:outline-none">
            {siteSettings.brandLogo ? (
              <img src={siteSettings.brandLogo} alt={siteSettings.businessName} className="w-10 h-10 object-contain rounded-full" />
            ) : (
              <div style={{ backgroundColor: accentColor, color: bgColor }} className="w-10 h-10 rounded-full flex items-center justify-center shadow-md">
                <Tent className="w-5 h-5 fill-current" />
              </div>
            )}
            <div>
              <span style={{ color: textColor }} className="font-serif text-xl md:text-2xl font-bold tracking-tight block leading-none">
                {siteSettings.businessName}
              </span>
              <span style={{ color: accentColor }} className="text-[10px] uppercase tracking-widest font-semibold block mt-0.5">
                {siteSettings.businessType || 'Staycation & Resort'}
              </span>
            </div>
          </button>

          <nav className="hidden xl:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  style={{ 
                    color: isActive ? accentColor : textColor,
                    backgroundColor: isActive ? cardBg : 'transparent',
                    opacity: isActive ? 1 : 0.8
                  }}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-100"
                >
                  {link.name}
                </button>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center space-x-2.5">
            <a
              href={`tel:${phoneClean}`}
              className="px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border transition-all hover:opacity-80"
              style={{ color: textColor, borderColor: borderCol, backgroundColor: cardBg }}
            >
              <Phone style={{ color: accentColor }} className="w-3.5 h-3.5" />
              <span>Call Now</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 bg-[#25D366] text-white hover:bg-[#20bd5a] transition-all shadow"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>
            <button
              onClick={onOpenBooking}
              style={{ backgroundColor: accentColor, color: bgColor, borderRadius: radius }}
              className="px-4 py-2 font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 fill-current" />
              <span>Book Now</span>
            </button>
          </div>

          <div className="flex lg:hidden items-center space-x-2">
            <a
              href={`tel:${phoneClean}`}
              className="p-2 rounded-lg bg-white/10 text-white flex items-center justify-center"
              aria-label="Call Now"
            >
              <Phone className="w-4 h-4 text-[#C5A059]" />
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-[#25D366] text-white flex items-center justify-center"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
            </a>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ color: textColor }} className="p-2 rounded-lg bg-white/10">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div style={{ backgroundColor: cardBg }} className="lg:hidden fixed inset-0 z-50 flex flex-col justify-between p-6 overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-6 border-b" style={{ borderBottomColor: borderCol }}>
              <div className="flex items-center gap-2">
                <Tent style={{ color: accentColor }} className="w-6 h-6" />
                <span style={{ color: textColor }} className="font-serif text-xl font-bold">
                  {siteSettings.businessName}
                </span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} style={{ color: textColor }}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="mt-6 space-y-1">
              {navLinks.map((link) => {
                const isActive = currentPath === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => handleNavClick(link.path)}
                    style={{
                      backgroundColor: isActive ? accentColor : 'transparent',
                      color: isActive ? bgColor : textColor,
                      borderRadius: radius
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-base font-medium transition-colors"
                  >
                    <span>{link.name}</span>
                    <span className="text-xs opacity-60">→</span>
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="space-y-3 pt-6 border-t" style={{ borderTopColor: borderCol }}>
            <button onClick={() => { setMobileMenuOpen(false); onOpenBooking(); }} style={{ backgroundColor: accentColor, color: bgColor, borderRadius: radius }} className="w-full py-3.5 font-bold text-center tracking-wider uppercase shadow-lg text-sm flex items-center justify-center gap-2">
              <Calendar className="w-5 h-5 fill-current" />
              <span>BOOK NOW / ENQUIRE</span>
            </button>
            <div className="grid grid-cols-2 gap-2">
              <a href={`tel:${phoneClean}`} className="py-3 rounded-xl bg-white/10 text-white font-semibold text-center text-xs flex items-center justify-center gap-1.5 border" style={{ borderColor: borderCol }}>
                <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Call Now</span>
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="py-3 rounded-xl bg-[#25D366] text-white font-semibold text-center text-xs flex items-center justify-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
