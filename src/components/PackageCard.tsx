import { Clock, Check, Sparkles, Calendar, Phone, MessageCircle } from 'lucide-react';
import { StayPackage, SiteSettings } from '../types';
import { buildWhatsAppUrl, buildPackageEnquiryWhatsAppMsg } from '../lib/whatsapp';

interface PackageCardProps {
  key?: string;
  pkg: StayPackage;
  onViewPackage: (slug: string) => void;
  onBookPackage: (pkg: StayPackage) => void;
  siteSettings: SiteSettings;
}

export function PackageCard({ pkg, onViewPackage, onBookPackage, siteSettings }: PackageCardProps) {
  const whatsappUrl = buildWhatsAppUrl(
    siteSettings.whatsappNumber,
    buildPackageEnquiryWhatsAppMsg(pkg.name)
  );
  const phoneDisplay = siteSettings.whatsappDisplayPhone || siteSettings.phone || '+91 8793020527';
  const phoneCall = (siteSettings.phone || siteSettings.whatsappNumber || '+91 8793020527').replace(/[^0-9+]/g, '');

  return (
    <div className="bg-[#1A2421] rounded-2xl overflow-hidden border border-white/10 shadow-xl hover:border-[#C5A059]/50 transition-all duration-300 group flex flex-col h-full">
      {/* Image & Badge Header */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0A0F0E]">
        <img
          src={pkg.coverImage}
          alt={pkg.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1715] via-transparent to-black/30" />

        <div className="absolute top-3 left-3">
          <span className="bg-[#0F1715]/90 text-[#C5A059] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm border border-[#C5A059]/30">
            {pkg.category}
          </span>
        </div>

        {pkg.isPopular && (
          <div className="absolute top-3 right-3 bg-[#C5A059] text-[#0F1715] text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow flex items-center gap-1 uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> Popular Choice
          </div>
        )}

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white bg-[#0F1715]/80 px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/10">
          <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>{pkg.duration}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#F5F2ED] group-hover:text-[#C5A059] transition-colors leading-snug mb-1">
            {pkg.name}
          </h3>

          {pkg.accommodationType && (
            <div className="inline-flex items-center gap-1.5 bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md border border-[#C5A059]/20 mb-3 tracking-wider">
              <span>🏡</span>
              <span>{pkg.accommodationType}</span>
            </div>
          )}

          <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed mb-4">
            {pkg.shortDescription}
          </p>

          {/* Pricing Highlight */}
          <div className="bg-[#0F1715] p-3 rounded-xl border border-white/10 mb-4 flex items-center justify-between">
            <span className="text-xs text-stone-400 font-medium">Starting Package Price</span>
            {pkg.price.isPriceOnRequest || !pkg.price.amount ? (
              <span className="text-xs font-bold text-[#C5A059]">Price on Request</span>
            ) : (
              <div className="text-right">
                <span className="text-lg font-extrabold text-[#C5A059]">
                  {pkg.price.currency}{pkg.price.amount.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-stone-400 block">{pkg.price.unit}</span>
              </div>
            )}
          </div>

          {/* Inclusions */}
          <div className="space-y-1.5 mb-5">
            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Key Package Highlights:</p>
            {pkg.inclusions.slice(0, 3).map((inc, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-stone-300">
                <Check className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                <span className="line-clamp-1 font-medium">{inc.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons & Contact */}
        <div className="space-y-2 pt-3 border-t border-white/10 mt-auto">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onViewPackage(pkg.slug)}
              className="w-full py-2.5 px-3 rounded-xl border border-white/20 text-[#F5F2ED] hover:bg-white/10 text-xs font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
              id={`view-pkg-${pkg.id}`}
            >
              <span>Package Details</span>
            </button>

            <button
              onClick={() => onBookPackage(pkg)}
              className="w-full py-2.5 px-3 rounded-xl bg-[#C5A059] hover:brightness-110 text-[#0F1715] text-xs font-bold uppercase tracking-wider transition-all text-center flex items-center justify-center gap-1 cursor-pointer shadow"
              id={`book-pkg-${pkg.id}`}
            >
              <Calendar className="w-3.5 h-3.5 text-[#0F1715]" />
              <span>Book Package</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={`tel:${phoneCall}`}
              className="w-full py-2 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5"
              id={`call-pkg-${pkg.id}`}
            >
              <Phone className="w-3 h-3 text-[#C5A059]" />
              <span>Call Now</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-2.5 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5"
              id={`whatsapp-pkg-${pkg.id}`}
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
