import { MessageCircle, Phone, Calendar } from 'lucide-react';
import { SiteSettings } from '../types';
import { buildWhatsAppUrl, buildGeneralEnquiryWhatsAppMsg } from '../lib/whatsapp';

interface FloatingControlsProps {
  siteSettings: SiteSettings;
  onOpenBooking: () => void;
}

export function FloatingControls({ siteSettings, onOpenBooking }: FloatingControlsProps) {
  const whatsappUrl = buildWhatsAppUrl(
    siteSettings.whatsappNumber,
    buildGeneralEnquiryWhatsAppMsg()
  );

  const phoneNum = siteSettings.phone || '+91 8793020527';
  const phoneClean = phoneNum.replace(/[^0-9+]/g, '');

  return (
    <>
      {/* Floating WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 md:bottom-6 right-5 z-40 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group border-2 border-white/80"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
        id="floating-whatsapp-btn"
      >
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border border-white"></span>
        <MessageCircle className="w-7 h-7 fill-current" />
        <span className="absolute right-16 top-2 bg-[#14291D] text-[#FAF8F5] text-xs font-semibold py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-[#C5A059]/30">
          Chat on WhatsApp
        </span>
      </a>

      {/* Fixed Bottom Mobile Action Bar with Two Equal Sections */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#14291D] border-t border-white/20 p-2.5 flex items-center gap-2 shadow-2xl backdrop-blur-md">
        <a
          href={`tel:${phoneClean}`}
          className="flex-1 py-3 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 border border-white/10 shadow transition-all text-center cursor-pointer"
          id="mobile-bottom-bar-call"
        >
          <Phone className="w-4 h-4 text-[#C5A059]" />
          <span>Call Now</span>
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 px-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow transition-all text-center cursor-pointer"
          id="mobile-bottom-bar-whatsapp"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>WhatsApp</span>
        </a>
      </div>
    </>
  );
}
