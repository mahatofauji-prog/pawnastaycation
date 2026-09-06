import { useState, useEffect } from 'react';
import { X, Check, Calendar, Users, Tent, Sparkles, Send, MessageCircle, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Stay, StayPackage, SiteSettings } from '../types';
import { api } from '../lib/api';
import { buildWhatsAppUrl, buildStayEnquiryWhatsAppMsg, buildPackageEnquiryWhatsAppMsg, buildFormEnquiryWhatsAppMsg } from '../lib/whatsapp';

interface BookingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  stays: Stay[];
  packages: StayPackage[];
  siteSettings: SiteSettings;
  preselectedItem?: Stay | StayPackage | null;
}

export function BookingWizardModal({
  isOpen,
  onClose,
  stays,
  packages,
  siteSettings,
  preselectedItem,
}: BookingWizardModalProps) {
  const [step, setStep] = useState(1);

  // Selection state
  const [selectedItemType, setSelectedItemType] = useState<'stay' | 'package'>('stay');
  const [selectedId, setSelectedId] = useState<string>('');

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfterStr = new Date(Date.now() + 172800000).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(tomorrowStr);
  const [checkOut, setCheckOut] = useState(dayAfterStr);
  const [guests, setGuests] = useState(2);

  // Add-ons
  const [addOns, setAddOns] = useState<{ [key: string]: boolean }>({
    privateBbq: false,
    coupleDecoration: false,
    kayaking: false,
  });

  // Customer info
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Submission result
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enquiryRef, setEnquiryRef] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedItem) {
      if ('amenities' in preselectedItem) {
        setSelectedItemType('stay');
        setSelectedId(preselectedItem.id);
      } else {
        setSelectedItemType('package');
        setSelectedId(preselectedItem.id);
      }
    } else if (stays.length > 0) {
      setSelectedItemType('stay');
      setSelectedId(stays[0].id);
    }
  }, [preselectedItem, stays, packages]);

  if (!isOpen) return null;

  const currentStay = selectedItemType === 'stay' ? stays.find((s) => s.id === selectedId) : null;
  const currentPkg = selectedItemType === 'package' ? packages.find((p) => p.id === selectedId) : null;
  const itemName = currentStay ? currentStay.name : currentPkg ? currentPkg.name : 'Pawna Lake Staycation';

  const handleNextStep = () => {
    if (step === 1 && !selectedId) return;
    if (step === 4 && (!customerName || !phone)) {
      alert('Please enter your Name and Mobile Phone Number to continue.');
      return;
    }
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitEnquiry = async () => {
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
    
    // Instantly close the modal to avoid showing any success screen
    onClose();
    setIsSubmitting(false);
  };

  const calculateNights = (inDate: string, outDate: string) => {
    if (!inDate || !outDate) return 1;
    const checkInDate = new Date(inDate);
    const checkOutDate = new Date(outDate);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const nightCount = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return nightCount > 0 ? nightCount : 1;
  };

  const nights = calculateNights(checkIn, checkOut);
  const basePrice = selectedItemType === 'stay' ? (currentStay?.price?.amount || 0) : (currentPkg?.price?.amount || 0);
  const totalPrice = basePrice * guests * nights;

  // Build direct WhatsApp link with payload for step 6 re-click
  const defaultMsg = selectedItemType === 'stay'
    ? buildStayEnquiryWhatsAppMsg(itemName, basePrice, checkIn, checkOut, guests)
    : buildPackageEnquiryWhatsAppMsg(itemName, checkIn, checkOut, guests);
  const whatsappUrl = buildWhatsAppUrl(siteSettings.whatsappNumber, defaultMsg);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#1A2421] text-[#F5F2ED] rounded-3xl max-w-2xl w-full shadow-2xl border border-white/10 overflow-hidden relative my-auto">
        {/* Header */}
        <div className="bg-[#0A0F0E] text-[#F5F2ED] p-5 md:p-6 flex items-center justify-between border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <Tent className="w-5 h-5 text-[#C5A059]" />
              <h3 className="font-serif text-xl font-light">Pawnastaycation Booking Enquiry</h3>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">Step {step} of 5 — Instant Availability & Quote Request</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#F5F2ED] transition-colors cursor-pointer"
            id="wizard-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#0F1715] h-1.5">
          <div
            className="bg-[#C5A059] h-1.5 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Content Body */}
        <div className="p-5 md:p-8 max-h-[75vh] overflow-y-auto">
          {/* STEP 1: Select Stay or Package */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="text-center max-w-md mx-auto">
                <h4 className="font-serif text-xl font-bold text-[#F5F2ED]">Select Your Experience</h4>
                <p className="text-xs text-stone-400 mt-1">Choose between private stays, tents, cottages or curated all-inclusive packages.</p>
              </div>

              {/* Selector Tabs */}
              <div className="flex bg-[#0F1715] p-1 rounded-2xl max-w-xs mx-auto border border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedItemType('stay')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    selectedItemType === 'stay' ? 'bg-[#C5A059] text-[#0F1715] shadow' : 'text-stone-400'
                  }`}
                >
                  Stays & Cottages
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedItemType('package')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    selectedItemType === 'package' ? 'bg-[#C5A059] text-[#0F1715] shadow' : 'text-stone-400'
                  }`}
                >
                  Packages
                </button>
              </div>

              {/* Grid of options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {selectedItemType === 'stay'
                  ? stays.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => setSelectedId(s.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                          selectedId === s.id
                            ? 'border-[#C5A059] bg-[#0F1715] shadow-lg'
                            : 'border-white/10 hover:border-white/20 bg-[#0F1715]/60'
                        }`}
                      >
                        <img src={s.mainImage} alt={s.name} className="w-16 h-16 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold uppercase text-[#C5A059]">{s.type}</span>
                          <h5 className="text-sm font-bold text-[#F5F2ED] truncate">{s.name}</h5>
                          <p className="text-xs font-semibold text-[#C5A059]">
                            {s.price.isPriceOnRequest || !s.price.amount
                              ? 'Price on Request'
                              : `₹${s.price.amount.toLocaleString('en-IN')} / person`}
                          </p>
                        </div>
                        {selectedId === s.id && (
                          <div className="w-6 h-6 rounded-full bg-[#C5A059] text-[#0F1715] flex items-center justify-center shrink-0">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    ))
                  : packages.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setSelectedId(p.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                          selectedId === p.id
                            ? 'border-[#C5A059] bg-[#0F1715] shadow-lg'
                            : 'border-white/10 hover:border-white/20 bg-[#0F1715]/60'
                        }`}
                      >
                        <img src={p.coverImage} alt={p.name} className="w-16 h-16 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold uppercase text-[#C5A059]">{p.category}</span>
                          <h5 className="text-sm font-bold text-[#F5F2ED] truncate">{p.name}</h5>
                          <p className="text-xs font-semibold text-[#C5A059]">
                            {p.price.isPriceOnRequest || !p.price.amount
                              ? 'Price on Request'
                              : `₹${p.price.amount.toLocaleString('en-IN')} / person`}
                          </p>
                        </div>
                        {selectedId === p.id && (
                          <div className="w-6 h-6 rounded-full bg-[#C5A059] text-[#0F1715] flex items-center justify-center shrink-0">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    ))}
              </div>
            </div>
          )}

          {/* STEP 2: Dates */}
          {step === 2 && (
            <div className="space-y-6 max-w-md mx-auto">
              <div className="text-center">
                <h4 className="font-serif text-xl font-bold text-[#FAF8F5]">Select Dates</h4>
                <p className="text-xs text-stone-400 mt-1">Check-in and Check-out dates for {itemName}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-[#F5F2ED] flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#C5A059]" />
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-2xl p-3 text-sm font-semibold focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-[#F5F2ED] flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#C5A059]" />
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    min={checkIn || todayStr}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-2xl p-3 text-sm font-semibold focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                  />
                </div>
              </div>

              <div className="text-center py-3 bg-[#0F1715] rounded-xl border border-white/10">
                <span className="text-[10px] text-stone-400 block uppercase font-bold tracking-wider">Duration Calculated</span>
                <span className="text-base font-bold text-[#C5A059]">{nights} Night{nights > 1 ? 's' : ''} Stay</span>
              </div>

              <div className="p-4 bg-[#0F1715] rounded-2xl border border-white/10 text-xs text-stone-300 leading-relaxed">
                📍 Check-in Default: <strong>{siteSettings.checkInDefault}</strong> | Check-out Default: <strong>{siteSettings.checkOutDefault}</strong>
                <br />
                Tea, BBQ, Dinner, and Breakfast are synchronized automatically with check-in.
              </div>
            </div>
          )}

          {/* STEP 3: Guests & Add-ons */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center max-w-md mx-auto">
                <h4 className="font-serif text-xl font-bold text-[#FAF8F5]">Guests & Custom Add-ons</h4>
                <p className="text-xs text-stone-400 mt-1">Tell us how many people are joining and personalize your staycation.</p>
              </div>

              {/* Guest Count */}
              <div className="bg-[#0F1715] p-4 rounded-2xl border border-white/10 flex items-center justify-between max-w-md mx-auto">
                <div>
                  <label className="text-sm font-bold text-[#FAF8F5] block">Number of Guests</label>
                  <span className="text-xs text-stone-400">Includes adults and children above 5 yrs</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setGuests((g) => Math.max(1, g - 1))}
                    className="w-9 h-9 rounded-full bg-[#1A2421] border border-white/20 text-[#FAF8F5] font-bold text-lg flex items-center justify-center hover:bg-white/10"
                  >
                    -
                  </button>
                  <span className="text-base font-extrabold text-[#FAF8F5] w-6 text-center">{guests}</span>
                  <button
                    type="button"
                    onClick={() => setGuests((g) => g + 1)}
                    className="w-9 h-9 rounded-full bg-[#C5A059] text-[#0F1715] font-bold text-lg flex items-center justify-center hover:brightness-110"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Optional Add-ons */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-stone-400">Enhance Your Staycation (Optional):</h5>

                <label className="p-3.5 rounded-2xl border border-white/10 bg-[#0F1715] flex items-center justify-between cursor-pointer hover:border-[#C5A059] transition-all">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={addOns.privateBbq}
                      onChange={(e) => setAddOns({ ...addOns, privateBbq: e.target.checked })}
                      className="w-5 h-5 rounded text-[#0F1715] focus:ring-[#C5A059]"
                    />
                    <div>
                      <p className="text-sm font-bold text-[#FAF8F5]">Private Live BBQ Grill Station</p>
                      <p className="text-xs text-stone-400">Dedicated live charcoal grill set up at your deck/tent</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#C5A059]">{addOns.privateBbq ? 'Added' : 'Add On'}</span>
                </label>

                <label className="p-3.5 rounded-2xl border border-white/10 bg-[#0F1715] flex items-center justify-between cursor-pointer hover:border-[#C5A059] transition-all">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={addOns.coupleDecoration}
                      onChange={(e) => setAddOns({ ...addOns, coupleDecoration: e.target.checked })}
                      className="w-5 h-5 rounded text-[#0F1715] focus:ring-[#C5A059]"
                    />
                    <div>
                      <p className="text-sm font-bold text-[#FAF8F5]">Romantic Candlelight & Floral Setup</p>
                      <p className="text-xs text-stone-400">For anniversaries, birthdays, or surprise couple dinners</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#C5A059]">{addOns.coupleDecoration ? 'Added' : 'Add On'}</span>
                </label>

                <label className="p-3.5 rounded-2xl border border-white/10 bg-[#0F1715] flex items-center justify-between cursor-pointer hover:border-[#C5A059] transition-all">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={addOns.kayaking}
                      onChange={(e) => setAddOns({ ...addOns, kayaking: e.target.checked })}
                      className="w-5 h-5 rounded text-[#0F1715] focus:ring-[#C5A059]"
                    />
                    <div>
                      <p className="text-sm font-bold text-[#FAF8F5]">Guided Pawna Kayaking Session</p>
                      <p className="text-xs text-stone-400">Includes instructor, life jacket & 45 min lake excursion</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#C5A059]">{addOns.kayaking ? 'Added' : 'Add On'}</span>
                </label>
              </div>

              {/* Real-time Dynamic Price Calculation Display */}
              <div className="bg-[#0F1715] p-4 rounded-2xl border border-[#C5A059]/40 space-y-2 mt-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-400">Selected Accommodation Rate:</span>
                  <span className="font-semibold text-[#FAF8F5]">₹{basePrice.toLocaleString('en-IN')} Per Person / Night</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-400">Guests & Duration:</span>
                  <span className="font-semibold text-[#FAF8F5]">{guests} Guest(s) × {nights} Night(s)</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">Estimated Total with Meal:</span>
                  <span className="text-base font-extrabold text-[#C5A059]">₹{totalPrice.toLocaleString('en-IN')}/-</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Customer Details */}
          {step === 4 && (
            <div className="space-y-4 max-w-md mx-auto">
              <div className="text-center">
                <h4 className="font-serif text-xl font-bold text-[#FAF8F5]">Your Contact Information</h4>
                <p className="text-xs text-stone-400 mt-1">We will send instant confirmation & quote details to your phone.</p>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#F5F2ED] block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                  id="wizard-name-input"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#F5F2ED] block mb-1">WhatsApp / Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                  id="wizard-phone-input"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#F5F2ED] block mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="e.g. rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                  id="wizard-email-input"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#F5F2ED] block mb-1">Special Notes / Dietary Preferences</label>
                <textarea
                  rows={2}
                  placeholder="e.g., Pure Veg BBQ required, anniversary occasion..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 text-stone-900 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                  id="wizard-message-input"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Booking Summary */}
          {step === 5 && (
            <div className="space-y-5">
              <div className="text-center max-w-md mx-auto">
                <h4 className="font-serif text-xl font-bold text-[#FAF8F5]">Booking Request Summary</h4>
                <p className="text-xs text-stone-400 mt-1">Review your details before submitting your enquiry.</p>
              </div>

              <div className="bg-[#0F1715] p-5 rounded-2xl border border-[#C5A059]/40 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span className="text-xs text-stone-400 uppercase font-semibold">Accommodation / Package:</span>
                  <span className="text-sm font-extrabold text-white text-right">{itemName}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-stone-400 block">Check-in:</span>
                    <span className="font-bold text-[#FAF8F5]">{checkIn}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Check-out:</span>
                    <span className="font-bold text-[#FAF8F5]">{checkOut}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Duration Selected:</span>
                    <span className="font-bold text-[#C5A059]">{nights} Night(s)</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Guests:</span>
                    <span className="font-bold text-[#FAF8F5]">{guests} Persons</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-stone-400 block">Guest Name:</span>
                    <span className="font-bold text-[#FAF8F5]">{customerName} ({phone})</span>
                  </div>
                </div>

                {/* Calculation Breakdown */}
                <div className="pt-3 border-t border-white/10 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Base Price per Person / Night:</span>
                    <span className="font-semibold text-white">₹{basePrice.toLocaleString('en-IN')}/-</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Calculation Formula:</span>
                    <span className="font-semibold text-white">₹{basePrice.toLocaleString('en-IN')} × {guests} Guests × {nights} Nights</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#1A2421] rounded-xl border border-[#C5A059]/30 mt-2">
                    <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">Estimated Total (with Meals):</span>
                    <span className="text-lg font-black text-[#C5A059]">₹{totalPrice.toLocaleString('en-IN')}/-</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 text-xs text-stone-300">
                  <span className="font-semibold text-[#C5A059] block mb-1">Inclusions:</span>
                  Welcome Drink, Evening Hi-Tea, Unlimited BBQ, Buffet Dinner, Morning Breakfast & Bonfire Night.
                </div>
              </div>

              <div className="p-3 bg-blue-950/30 rounded-xl border border-blue-500/20 text-xs text-blue-200 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
                <span>Zero advance fee required to submit an enquiry. Our booking manager will verify availability immediately.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {step < 6 && (
          <div className="p-4 md:p-6 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="py-2.5 px-4 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 flex items-center gap-1"
                id="wizard-back-btn"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="py-2.5 px-6 rounded-xl bg-[#14291D] hover:bg-[#1E3A2B] text-[#FAF8F5] font-bold text-xs flex items-center gap-2 shadow"
                id="wizard-next-btn"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 text-[#C5A059]" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitEnquiry}
                className="py-3 px-6 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
                id="wizard-submit-btn"
              >
                {isSubmitting ? (
                  <span>Opening WhatsApp...</span>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>ENQUIRE ON WHATSAPP</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
