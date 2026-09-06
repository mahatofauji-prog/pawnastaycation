import React, { useState } from 'react';
import { Calendar as CalendarIcon, Users, Tent, Search } from 'lucide-react';
import { SiteSettings } from '../types';

interface QuickSearchProps {
  onSearch: (guests: number, checkIn: string, stayType: string, checkOut?: string) => void;
  siteSettings: SiteSettings;
}

export function QuickSearch({ onSearch, siteSettings }: QuickSearchProps) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 1);

  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(formatDate(tomorrow));
  const [checkOut, setCheckOut] = useState(formatDate(dayAfter));
  const [guests, setGuests] = useState(2);
  const [stayType, setStayType] = useState<string>('All');

  const stayOptions = [
    { label: 'All Accommodations', value: 'All' },
    { label: 'Glamping Tents', value: 'Glamping Tent' },
    { label: 'Cottages', value: 'Cottage' },
    { label: 'Camping', value: 'Camping' },
    { label: 'Villas / Suites', value: 'Villa / Suite' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(guests, checkIn, stayType, checkOut);
  };

  const accentColor = siteSettings.themeColors?.primary || '#C5A059';
  const cardBg = siteSettings.themeColors?.cardBg || '#14291D';
  const borderCol = siteSettings.themeColors?.border || 'rgba(197,160,89,0.3)';
  const radius = siteSettings.themeBorderRadius === 'none' ? '0' : siteSettings.themeBorderRadius === 'sm' ? '0.25rem' : siteSettings.themeBorderRadius === 'md' ? '0.5rem' : siteSettings.themeBorderRadius === 'lg' ? '0.75rem' : siteSettings.themeBorderRadius === 'xl' ? '1rem' : '1rem';

  return (
    <div
      style={{ backgroundColor: cardBg, borderColor: borderCol, borderRadius: radius }}
      className="p-4 sm:p-6 md:p-8 shadow-2xl border max-w-6xl mx-auto w-full relative z-20"
      id="quick-booking-search-container"
    >
      <div className="mb-4 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <span style={{ color: accentColor }} className="text-[10px] font-bold uppercase tracking-[0.25em] block">
            Plan Your Getaway
          </span>
          <h3 className="text-base sm:text-lg font-serif font-bold text-white">
            Check Availability & Rates
          </h3>
        </div>
        <span className="text-xs text-stone-300 hidden sm:inline">
          Best Rate Guarantee • Instant Confirmation
        </span>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 items-end">
        {/* Check-in */}
        <div className="space-y-1.5">
          <label style={{ color: accentColor }} className="text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5 shrink-0" /> Check-in
          </label>
          <input
            type="date"
            min={formatDate(today)}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full bg-white text-stone-900 border border-stone-300 rounded-lg py-2.5 px-3 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-[#C5A059] focus:outline-none shadow-sm"
            required
          />
        </div>

        {/* Check-out */}
        <div className="space-y-1.5">
          <label style={{ color: accentColor }} className="text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5 shrink-0" /> Check-out
          </label>
          <input
            type="date"
            min={checkIn || formatDate(today)}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full bg-white text-stone-900 border border-stone-300 rounded-lg py-2.5 px-3 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-[#C5A059] focus:outline-none shadow-sm"
            required
          />
        </div>

        {/* Guests */}
        <div className="space-y-1.5">
          <label style={{ color: accentColor }} className="text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 shrink-0" /> Guests
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full bg-white text-stone-900 border border-stone-300 rounded-lg py-2.5 px-3 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-[#C5A059] focus:outline-none shadow-sm cursor-pointer"
          >
            {[1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20].map((num) => (
              <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
            ))}
          </select>
        </div>

        {/* Stay Type */}
        <div className="space-y-1.5">
          <label style={{ color: accentColor }} className="text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5">
            <Tent className="w-3.5 h-3.5 shrink-0" /> Stay Type
          </label>
          <select
            value={stayType}
            onChange={(e) => setStayType(e.target.value)}
            className="w-full bg-white text-stone-900 border border-stone-300 rounded-lg py-2.5 px-3 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-[#C5A059] focus:outline-none shadow-sm cursor-pointer"
          >
            {stayOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <div>
          <button
            type="submit"
            style={{ backgroundColor: accentColor, color: '#14291D' }}
            className="w-full py-2.5 sm:py-3 px-4 font-black text-xs uppercase tracking-widest rounded-lg shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:brightness-110 active:scale-[0.99] transition-all"
            id="hero-quick-search-submit-btn"
          >
            <Search className="w-4 h-4 fill-current" />
            <span>Search Stays</span>
          </button>
        </div>
      </form>
    </div>
  );
}

