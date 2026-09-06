import React, { useState } from 'react';
import { PhoneCall, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { Stay, StayPackage, SiteSettings } from '../types';
import { SEOHead } from '../components/SEOHead';
import { buildWhatsAppUrl, buildFormEnquiryWhatsAppMsg } from '../lib/whatsapp';

interface ContactPageProps {
  siteSettings: SiteSettings;
  stays: Stay[];
  packages: StayPackage[];
  onNavigate: (path: string) => void;
}

export function ContactPage({ siteSettings, stays, packages, onNavigate }: ContactPageProps) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [guests, setGuests] = useState(2);
  const [selectedInterest, setSelectedInterest] = useState('General Enquiry');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const inDate = checkIn || '[Selected Date]';
    const outDate = checkIn ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0] : '[Selected Date]';
    
    // Generate WhatsApp Message according to prompt templates
    const finalMsg = buildFormEnquiryWhatsAppMsg({
      customerName,
      phone,
      itemName: selectedInterest,
      checkIn: inDate,
      checkOut: outDate,
      guests,
      message,
    });

    const targetUrl = buildWhatsAppUrl(siteSettings.whatsappNumber, finalMsg);
    setWhatsappUrl(targetUrl);
    
    // Open WhatsApp in a new tab immediately
    window.open(targetUrl, '_blank');
    
    setIsSubmitting(false);
  };

  const bgColor = siteSettings.themeColors.background;
  const textColor = siteSettings.themeColors.text;
  const accentColor = siteSettings.themeColors.primary;
  const cardBg = siteSettings.themeColors.cardBg;
  const textMuted = siteSettings.themeColors.textMuted;
  const borderCol = siteSettings.themeColors.border;
  const radius = siteSettings.themeBorderRadius === 'none' ? '0' : siteSettings.themeBorderRadius === 'sm' ? '0.125rem' : siteSettings.themeBorderRadius === 'md' ? '0.375rem' : siteSettings.themeBorderRadius === 'lg' ? '0.5rem' : siteSettings.themeBorderRadius === 'xl' ? '0.75rem' : '1rem';

  return (
    <div style={{ backgroundColor: bgColor, minHeight: '100vh', paddingBottom: '6rem' }}>
      <SEOHead
        title={`Contact Us | ${siteSettings.businessName}`}
        description={`Contact ${siteSettings.businessName} for bookings, group enquiries, and general questions.`}
      />

      <div style={{ backgroundColor: cardBg, color: textColor, borderBottom: `1px solid ${borderCol}` }} className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <span style={{ color: accentColor }} className="text-xs font-bold uppercase tracking-widest block mb-2">
            Get In Touch
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">
            Contact & Support
          </h1>
          <p style={{ color: textMuted }} className="text-sm sm:text-base max-w-2xl mx-auto mt-3">
            Ready to book your escape? Send us an enquiry or message us directly on WhatsApp for immediate assistance.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Contact Details Column */}
          <div style={{ backgroundColor: cardBg, borderColor: borderCol, borderRadius: radius }} className="lg:col-span-1 p-8 border shadow-sm space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-bold border-b pb-4" style={{ color: textColor, borderBottomColor: borderCol }}>Direct Contact</h2>
              
              <div className="flex items-start gap-3">
                <div style={{ backgroundColor: bgColor, color: accentColor }} className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <span style={{ color: textMuted }} className="text-[10px] font-bold uppercase block">Phone</span>
                  <a href={`tel:${siteSettings.phone.replace(/[^0-9+]/g, '')}`} style={{ color: textColor }} className="font-semibold hover:underline">
                    {siteSettings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div style={{ backgroundColor: bgColor, color: accentColor }} className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                </div>
                <div>
                  <span style={{ color: textMuted }} className="text-[10px] font-bold uppercase block">WhatsApp</span>
                  <a 
                    href={buildWhatsAppUrl(siteSettings.whatsappNumber, "Hello Pawnastaycation, I want to enquire about your Pawna Lake stay. Please share availability and booking details.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: textColor }} 
                    className="font-semibold hover:underline"
                  >
                    {siteSettings.whatsappDisplayPhone || siteSettings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div style={{ backgroundColor: bgColor, color: accentColor }} className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span style={{ color: textMuted }} className="text-[10px] font-bold uppercase block">Email Address</span>
                  <a href={`mailto:${siteSettings.email}`} style={{ color: textColor }} className="font-semibold hover:underline">
                    {siteSettings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div style={{ backgroundColor: bgColor, color: accentColor }} className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span style={{ color: textMuted }} className="text-[10px] font-bold uppercase block">Property Location</span>
                  <p style={{ color: textColor, whiteSpace: 'pre-line' }} className="font-semibold">{siteSettings.locationAddress}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div style={{ backgroundColor: bgColor, color: accentColor }} className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span style={{ color: textMuted }} className="text-[10px] font-bold uppercase block">Enquiry Operating Hours</span>
                  <p style={{ color: textColor }} className="font-semibold">09:00 AM to 09:00 PM</p>
                </div>
              </div>

            </div>

            <div className="pt-4 border-t space-y-2.5" style={{ borderTopColor: borderCol }}>
              <a
                href={`tel:${siteSettings.phone.replace(/[^0-9+]/g, '')}`}
                className="w-full py-3.5 px-4 rounded-2xl border font-extrabold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2"
                style={{ borderColor: borderCol, color: textColor, backgroundColor: cardBg }}
                id="contact-page-call-now-btn"
              >
                <PhoneCall style={{ color: accentColor }} className="w-4 h-4" />
                <span>Call Now</span>
              </a>
              <a
                href={buildWhatsAppUrl(siteSettings.whatsappNumber, "Hello Pawnastaycation, I want to enquire about your Pawna Lake stay. Please share availability and booking details.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                id="contact-page-whatsapp-btn"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Form Column */}
          <div style={{ backgroundColor: cardBg, borderColor: borderCol, borderRadius: radius }} className="lg:col-span-2 p-8 border shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 style={{ color: textColor }} className="font-serif text-2xl font-bold">Send an Online Enquiry</h3>
                  <p style={{ color: textMuted }} className="text-xs mt-1">Fill out your travel details and we will get back to you with custom pricing.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={{ color: textColor }} className="text-xs font-bold uppercase block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Deshmukh"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      style={{ backgroundColor: bgColor, color: textColor, borderColor: borderCol }}
                      className="w-full border rounded-xl p-3 text-xs focus:ring-2 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label style={{ color: textColor }} className="text-xs font-bold uppercase block mb-1">Mobile / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ backgroundColor: bgColor, color: textColor, borderColor: borderCol }}
                      className="w-full border rounded-xl p-3 text-xs focus:ring-2 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={{ color: textColor }} className="text-xs font-bold uppercase block mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. ananya@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ backgroundColor: bgColor, color: textColor, borderColor: borderCol }}
                      className="w-full border rounded-xl p-3 text-xs focus:ring-2 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label style={{ color: textColor }} className="text-xs font-bold uppercase block mb-1">Accommodation / Package Interest</label>
                    <select
                      value={selectedInterest}
                      onChange={(e) => setSelectedInterest(e.target.value)}
                      style={{ backgroundColor: bgColor, color: textColor, borderColor: borderCol }}
                      className="w-full border rounded-xl p-3 text-xs font-semibold focus:ring-2 focus:outline-none"
                    >
                      <option value="General Enquiry">General Enquiry</option>
                      {stays.map((s) => (
                        <option key={s.id} value={s.name}>Stay: {s.name}</option>
                      ))}
                      {packages.map((p) => (
                        <option key={p.id} value={p.name}>Package: {p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label style={{ color: textColor }} className="text-xs font-bold uppercase block mb-1">Tentative Check-in Date</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      style={{ backgroundColor: bgColor, color: textColor, borderColor: borderCol }}
                      className="w-full border rounded-xl p-3 text-xs font-semibold focus:ring-2 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label style={{ color: textColor }} className="text-xs font-bold uppercase block mb-1">Number of Guests</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      style={{ backgroundColor: bgColor, color: textColor, borderColor: borderCol }}
                      className="w-full border rounded-xl p-3 text-xs font-semibold focus:ring-2 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ color: textColor }} className="text-xs font-bold uppercase block mb-1">Message / Custom Requirements</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us if you need veg/non-veg BBQ, cake/decoration for celebration, or transport assistance..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ backgroundColor: bgColor, color: textColor, borderColor: borderCol }}
                    className="w-full border rounded-xl p-3 text-xs focus:ring-2 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ backgroundColor: '#25D366', color: '#FFFFFF', borderRadius: radius }}
                  className="w-full py-4 font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.01]"
                  id="contact-form-submit-btn"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>{isSubmitting ? 'Opening WhatsApp...' : 'ENQUIRE ON WHATSAPP'}</span>
                </button>
              </form>
          </div>

        </div>
      </div>
    </div>
  );
}
