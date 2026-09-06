import React, { useState } from 'react';
import { Calendar, Check, Send, ShieldCheck, MessageCircle } from 'lucide-react';
import { Stay, StayPackage, SiteSettings } from '../types';
import { api } from '../lib/api';
import { SEOHead } from '../components/SEOHead';
import { buildWhatsAppUrl, buildStayEnquiryWhatsAppMsg, buildPackageEnquiryWhatsAppMsg, buildFormEnquiryWhatsAppMsg } from '../lib/whatsapp';

interface BookingPageProps {
  stays: Stay[];
  packages: StayPackage[];
  siteSettings: SiteSettings;
}

export function BookingPage({ stays, packages, siteSettings }: BookingPageProps) {
  const [selectedType, setSelectedType] = useState<'stay' | 'package'>('stay');
  const [selectedId, setSelectedId] = useState<string>(stays[0]?.id || '');

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfterStr = new Date(Date.now() + 172800000).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(tomorrowStr);
  const [checkOut, setCheckOut] = useState(dayAfterStr);
  const [guests, setGuests] = useState(2);

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enquiryRef, setEnquiryRef] = useState<string | null>(null);

  const currentStay = selectedType === 'stay' ? stays.find((s) => s.id === selectedId) : null;
  const currentPkg = selectedType === 'package' ? packages.find((p) => p.id === selectedId) : null;
  const itemName = currentStay ? currentStay.name : currentPkg ? currentPkg.name : 'Pawna Staycation';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone) {
      alert('Please fill in your Name and Mobile Number.');
      return;
    }

    setIsSubmitting(true);
    
    // Generate WhatsApp Message according to prompt templates
    const finalMsg = buildFormEnquiryWhatsAppMsg({
      customerName,
      phone,
      itemName,
      checkIn,
      checkOut,
      guests,
      message,
    });

    const targetUrl = buildWhatsAppUrl(siteSettings.whatsappNumber, finalMsg);
    
    // Open WhatsApp in a new tab immediately
    window.open(targetUrl, '_blank');
    
    setIsSubmitting(false);
  };

  const finalMsg = buildFormEnquiryWhatsAppMsg({
    customerName,
    phone,
    itemName,
    checkIn,
    checkOut,
    guests,
    message,
  });
  const whatsappUrl = buildWhatsAppUrl(siteSettings.whatsappNumber, finalMsg);

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      <SEOHead
        title="Book Your Stay | Pawnastaycation Pawna Lake"
        description="Book your stay at Pawna Lake: luxury glamping domes, wooden cottages, and lakeside tents. Check availability & instant quote."
        canonicalUrl="https://pawnastaycation.com/booking"
      />

      <div className="bg-[#14291D] text-[#FAF8F5] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#C5A059]/30">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059] block mb-2">
            Instant Quote & Booking Request
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">
            Reserve Your Pawna Getaway
          </h1>
          <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto mt-3">
            Zero advance fee required to send an enquiry. All bookings are processed instantly via WhatsApp.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-xl space-y-8">
            {/* Step 1: Choose Property / Package */}
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-bold text-[#14291D]">1. Select Accommodation or Package</h3>

              <div className="flex bg-stone-100 p-1.5 rounded-2xl max-w-xs">
                <button
                  type="button"
                  onClick={() => setSelectedType('stay')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    selectedType === 'stay' ? 'bg-[#14291D] text-[#FAF8F5] shadow' : 'text-stone-600'
                  }`}
                >
                  Stays
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedType('package')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    selectedType === 'package' ? 'bg-[#14291D] text-[#FAF8F5] shadow' : 'text-stone-600'
                  }`}
                >
                  Packages
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {selectedType === 'stay'
                  ? stays.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => setSelectedId(s.id)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                          selectedId === s.id
                            ? 'border-[#C5A059] bg-[#FAF8F5] shadow-md'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <img src={s.mainImage} alt={s.name} className="w-14 h-14 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold uppercase text-[#C5A059]">{s.type}</span>
                          <h5 className="text-xs font-bold text-[#1F2421] truncate">{s.name}</h5>
                          <p className="text-xs font-bold text-[#14291D]">
                            {s.price.isPriceOnRequest || !s.price.amount
                              ? 'Price on Request'
                              : `₹${s.price.amount.toLocaleString('en-IN')}`}
                          </p>
                        </div>
                        {selectedId === s.id && <Check className="w-5 h-5 text-[#C5A059] shrink-0" />}
                      </div>
                    ))
                  : packages.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setSelectedId(p.id)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                          selectedId === p.id
                            ? 'border-[#C5A059] bg-[#FAF8F5] shadow-md'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <img src={p.coverImage} alt={p.name} className="w-14 h-14 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold uppercase text-[#C5A059]">{p.category}</span>
                          <h5 className="text-xs font-bold text-[#1F2421] truncate">{p.name}</h5>
                          <p className="text-xs font-bold text-[#14291D]">
                            {p.price.isPriceOnRequest || !p.price.amount
                              ? 'Price on Request'
                              : `₹${p.price.amount.toLocaleString('en-IN')}`}
                          </p>
                        </div>
                        {selectedId === p.id && <Check className="w-5 h-5 text-[#C5A059] shrink-0" />}
                      </div>
                    ))}
              </div>
            </div>

            {/* Step 2: Dates & Guests */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <h3 className="font-serif text-2xl font-bold text-[#14291D]">2. Travel Dates & Guests</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-[#14291D] block mb-1">Check-in Date *</label>
                  <input
                    type="date"
                    min={todayStr}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs font-semibold focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-[#14291D] block mb-1">Check-out Date *</label>
                  <input
                    type="date"
                    min={checkIn || todayStr}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs font-semibold focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-[#14291D] block mb-1">Guests Count *</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs font-semibold focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Guest Details */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <h3 className="font-serif text-2xl font-bold text-[#14291D]">3. Guest Details</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-[#14291D] block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikramaditya Rao"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-[#14291D] block mb-1">WhatsApp / Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#14291D] block mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="e.g. vikram@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#14291D] block mb-1">Special Notes / Dietary Requirements</label>
                <textarea
                  rows={2}
                  placeholder="e.g., Pure Veg BBQ required, anniversary cake request..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.01]"
              id="booking-page-submit-btn"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>{isSubmitting ? 'Opening WhatsApp...' : 'ENQUIRE ON WHATSAPP'}</span>
            </button>
          </form>
      </div>
    </div>
  );
}
