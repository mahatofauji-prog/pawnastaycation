import { Star, Users, MapPin, Check, Sparkles, MessageCircle, Calendar } from 'lucide-react';
import { Stay, SiteSettings } from '../types';
import { buildWhatsAppUrl, buildStayEnquiryWhatsAppMsg } from '../lib/whatsapp';

interface StayCardProps {
  key?: string;
  stay: Stay;
  onViewDetails: (slug: string) => void;
  onBookNow: (stay: Stay) => void;
  siteSettings: SiteSettings;
}

export function StayCard({ stay, onViewDetails, onBookNow, siteSettings }: StayCardProps) {
  const whatsappUrl = buildWhatsAppUrl(
    siteSettings.whatsappNumber,
    buildStayEnquiryWhatsAppMsg(stay.name, stay.price.amount)
  );

  return (
    <div className="bg-[#1A2421] rounded-2xl overflow-hidden border border-white/10 shadow-xl hover:border-[#C5A059]/50 transition-all duration-300 group flex flex-col h-full">
      {/* Card Header / Image Container */}
      <div 
        className="relative aspect-[4/3] overflow-hidden bg-[#0A0F0E] cursor-pointer"
        onClick={() => onViewDetails(stay.slug)}
      >
        <img
          src={stay.featuredImage || stay.mainImage}
          alt={stay.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1715] via-transparent to-black/30" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className="bg-[#0F1715]/90 text-[#C5A059] text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm border border-[#C5A059]/30">
            {stay.type}
          </span>
          {stay.isLakeView && (
            <span className="bg-[#1A2421]/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm flex items-center gap-1 border border-white/10">
              🌊 Lake View
            </span>
          )}
        </div>

        {stay.isFeatured && (
          <div className="absolute top-3 right-3 bg-[#C5A059] text-[#0F1715] text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow flex items-center gap-1 uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> Featured
          </div>
        )}

        {/* Price Tag Overlay on Image */}
        <div className="absolute bottom-3 right-3 bg-[#0F1715]/95 text-[#F5F2ED] py-1.5 px-3 rounded-xl border border-[#C5A059]/40 backdrop-blur-md shadow-lg text-right">
          {stay.price.isPriceOnRequest || !stay.price.amount ? (
            <span className="text-xs font-bold text-[#C5A059] tracking-wide block">Price on Request</span>
          ) : (
            <div>
              <div className="flex items-baseline gap-1 justify-end">
                <span className="text-xs text-stone-400">from</span>
                <span className="text-base font-extrabold text-[#C5A059]">
                  {stay.price.currency}{stay.price.amount.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-[10px] text-stone-400 block">{stay.price.period}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Location */}
          <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
            <span className="flex items-center gap-1 font-medium text-stone-300">
              <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
              {stay.location.split(',')[0]}
            </span>
            {stay.rating && (
              <div className="flex items-center gap-1 text-[#C5A059] font-bold bg-[#0F1715] px-2 py-0.5 rounded-md border border-white/10">
                <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
                <span>{stay.rating}</span>
                {stay.reviewsCount && <span className="text-stone-400 text-[10px]">({stay.reviewsCount})</span>}
              </div>
            )}
          </div>

          {/* Title */}
          <h3 
            onClick={() => onViewDetails(stay.slug)}
            className="font-serif text-xl font-bold text-[#F5F2ED] group-hover:text-[#C5A059] transition-colors leading-snug mb-1.5 cursor-pointer"
          >
            {stay.name}
          </h3>

          <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed mb-4">
            {stay.tagline}
          </p>

          {/* Key Specs / Capacity */}
          <div className="flex items-center gap-3 py-2 border-y border-white/10 text-xs text-stone-300 mb-4 font-medium">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#C5A059]" />
              Capacity: {stay.capacity.minGuests} - {stay.capacity.maxGuests} Guests
            </span>
            <span className="text-stone-600">•</span>
            <span className="text-stone-400 truncate">{stay.capacity.idealFor}</span>
          </div>

          {/* Amenities Pill Badges */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {stay.amenities.slice(0, 4).map((amenity, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/5 text-stone-300 border border-white/10"
              >
                <Check className="w-3 h-3 text-[#C5A059]" />
                {amenity}
              </span>
            ))}
            {stay.amenities.length > 4 && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30">
                +{stay.amenities.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: BOOK NOW & WHATSAPP ENQUIRY */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 mt-auto">
          <button
            onClick={() => onBookNow(stay)}
            className="w-full py-2.5 px-3 rounded-xl bg-[#C5A059] hover:brightness-110 text-[#0F1715] text-xs font-bold uppercase tracking-wider transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow hover:shadow-md"
            id={`book-now-${stay.id}`}
          >
            <Calendar className="w-3.5 h-3.5 fill-current" />
            <span>Book Now</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider transition-all text-center flex items-center justify-center gap-1.5 shadow cursor-pointer"
            id={`whatsapp-enquiry-${stay.id}`}
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>WhatsApp Enquiry</span>
          </a>
        </div>
      </div>
    </div>
  );
}
