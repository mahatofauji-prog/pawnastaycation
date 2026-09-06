import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, Anchor, Tent, Navigation as NavIcon } from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  onNavigate: (path: string) => void;
  siteSettings: SiteSettings;
  onOpenBooking?: () => void;
}

export function Footer({ onNavigate, siteSettings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  const bgColor = siteSettings.themeColors.background;
  const textColor = siteSettings.themeColors.text;
  const accentColor = siteSettings.themeColors.primary;
  const cardBg = siteSettings.themeColors.cardBg;
  const textMuted = siteSettings.themeColors.textMuted;
  const borderCol = siteSettings.themeColors.border;

  return (
    <footer style={{ backgroundColor: cardBg, color: textColor, borderTop: `1px solid ${borderCol}` }} className="pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Tent style={{ color: accentColor }} className="w-6 h-6" />
              <span className="font-serif text-2xl font-bold tracking-tight">
                {siteSettings.businessName}
              </span>
            </div>
            <p style={{ color: textMuted }} className="text-sm leading-relaxed max-w-sm">
              {siteSettings.shortDescription || 'Experience premium stays with authentic outdoor adventures.'}
            </p>
            <div className="flex items-center gap-4 pt-2">
              {siteSettings.socialLinks?.instagram && (
                <a href={siteSettings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" style={{ color: textMuted }} className="hover:opacity-80 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {siteSettings.socialLinks?.facebook && (
                <a href={siteSettings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" style={{ color: textMuted }} className="hover:opacity-80 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {siteSettings.socialLinks?.youtube && (
                <a href={siteSettings.socialLinks.youtube} target="_blank" rel="noopener noreferrer" style={{ color: textMuted }} className="hover:opacity-80 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { name: 'Accommodations', path: '/stays' },
                { name: 'Services & Facilities', path: '/services' },
                { name: 'Special Packages', path: '/packages' },
                { name: 'Stories & Travel Blogs', path: '/blog' },
                { name: 'Photo Gallery', path: '/gallery' },
              ].map((link) => (
                <li key={link.path}>
                  <a href={link.path} onClick={(e) => handleNavClick(e, link.path)} style={{ color: textMuted }} className="text-sm hover:opacity-80 transition-colors inline-flex items-center gap-1 group">
                    <span className="w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all" style={{ backgroundColor: accentColor }} />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold mb-4">Help & Info</h3>
            <ul className="space-y-2.5">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Location & Map', path: '/location' },
                { name: 'FAQs', path: '/faqs' },
                { name: 'Contact Us', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <a href={link.path} onClick={(e) => handleNavClick(e, link.path)} style={{ color: textMuted }} className="text-sm hover:opacity-80 transition-colors inline-flex items-center gap-1 group">
                    <span className="w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all" style={{ backgroundColor: accentColor }} />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin style={{ color: accentColor }} className="w-5 h-5 shrink-0 mt-0.5" />
                <span style={{ color: textMuted, whiteSpace: 'pre-line' }} className="text-sm leading-relaxed">{siteSettings.locationAddress}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone style={{ color: accentColor }} className="w-5 h-5 shrink-0" />
                <a href={`tel:${siteSettings.phone}`} style={{ color: textMuted }} className="text-sm hover:opacity-80 transition-colors">{siteSettings.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail style={{ color: accentColor }} className="w-5 h-5 shrink-0" />
                <a href={`mailto:${siteSettings.email}`} style={{ color: textMuted }} className="text-sm hover:opacity-80 transition-colors">{siteSettings.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ borderColor: borderCol }} className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs text-center md:text-left" style={{ color: textMuted }}>
            <p>
              © {currentYear} {siteSettings.businessName}. All rights reserved.
            </p>
            <span className="hidden sm:inline opacity-30">|</span>
            <p>
              Design By{' '}
              <a
                href="https://www.manisolution.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 underline transition-opacity"
              >
                MANI Solution
              </a>
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs" style={{ color: textMuted }}>
            <a href="/terms" onClick={(e) => handleNavClick(e, '/terms')} className="hover:opacity-80 transition-colors">Terms of Service</a>
            <a href="/privacy" onClick={(e) => handleNavClick(e, '/privacy')} className="hover:opacity-80 transition-colors">Privacy Policy</a>
            <a href="/cancellation" onClick={(e) => handleNavClick(e, '/cancellation')} className="hover:opacity-80 transition-colors">Cancellation Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
