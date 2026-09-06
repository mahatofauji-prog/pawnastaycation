import React, { useState, useMemo } from 'react';
import { ChevronRight, MessageCircle } from 'lucide-react';
import { FAQItem, SiteSettings } from '../types';
import { SEOHead } from '../components/SEOHead';
import { buildWhatsAppUrl } from '../lib/whatsapp';

interface FAQsPageProps {
  faqs: FAQItem[];
  siteSettings: SiteSettings;
  onNavigate?: (path: string) => void;
}

export function FAQsPage({ faqs, siteSettings }: FAQsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = new Set<string>();
    faqs.forEach(f => cats.add(f.category));
    return ['All', ...Array.from(cats).sort()];
  }, [faqs]);

  const filteredFaqs = selectedCategory === 'All'
    ? faqs
    : faqs.filter((f) => f.category === selectedCategory);

  const bgColor = siteSettings.themeColors.background;
  const textColor = siteSettings.themeColors.text;
  const accentColor = siteSettings.themeColors.primary;
  const cardBg = siteSettings.themeColors.cardBg;
  const textMuted = siteSettings.themeColors.textMuted;
  const borderCol = siteSettings.themeColors.border;
  const radius = siteSettings.themeBorderRadius === 'none' ? '0' : siteSettings.themeBorderRadius === 'sm' ? '0.125rem' : siteSettings.themeBorderRadius === 'md' ? '0.375rem' : siteSettings.themeBorderRadius === 'lg' ? '0.5rem' : siteSettings.themeBorderRadius === 'xl' ? '0.75rem' : '1rem';

  const currentWhatsappDisplay = siteSettings.whatsappDisplayPhone || siteSettings.phone || '+91 8793020527';
  const whatsappUrl = buildWhatsAppUrl(
    siteSettings.whatsappNumber || '918793020527',
    `Hello ${siteSettings.businessName || 'Pawnastaycation'}, I want to enquire about booking a stay at Pawna Lake.`
  );

  const renderAnswerContent = (text: string) => {
    // Replace any legacy/hardcoded numbers with the dynamic business settings WhatsApp number
    let processedText = text;
    const legacyNumberRegex = /\+?91[\s-]?[0-9]{5}[\s-]?[0-9]{5}|\+?91[\s-]?[0-9]{10}/g;
    
    // Check if the answer mentions WhatsApp
    const isWhatsAppFaq = /whatsapp/i.test(processedText);

    if (isWhatsAppFaq) {
      processedText = processedText.replace(legacyNumberRegex, currentWhatsappDisplay);
      
      // Split on the current WhatsApp display number to insert a clickable interactive link
      const parts = processedText.split(currentWhatsappDisplay);
      return (
        <div className="space-y-3">
          <p style={{ color: textMuted }} className="text-sm leading-relaxed whitespace-pre-line">
            {parts.map((part, idx) => (
              <React.Fragment key={idx}>
                {part}
                {idx < parts.length - 1 && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#25D366] hover:underline inline-flex items-center gap-1 mx-1"
                    title="Open WhatsApp Chat"
                  >
                    <span>{currentWhatsappDisplay}</span>
                  </a>
                )}
              </React.Fragment>
            ))}
          </p>
          <div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Chat with us on WhatsApp ({currentWhatsappDisplay})</span>
            </a>
          </div>
        </div>
      );
    }

    return (
      <p style={{ color: textMuted }} className="text-sm leading-relaxed whitespace-pre-line">
        {processedText}
      </p>
    );
  };

  return (
    <div style={{ backgroundColor: bgColor, minHeight: '100vh', paddingBottom: '6rem' }}>
      <SEOHead
        title={`Frequently Asked Questions | ${siteSettings.businessName}`}
        description={`Find answers to common questions about ${siteSettings.businessName}.`}
      />

      <div style={{ backgroundColor: cardBg, color: textColor, borderBottom: `1px solid ${borderCol}` }} className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <span style={{ color: accentColor }} className="text-xs font-bold uppercase tracking-widest block mb-2">
            Support & Information
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">
            Frequently Asked Questions
          </h1>
          <p style={{ color: textMuted }} className="text-sm sm:text-base max-w-2xl mx-auto mt-3">
            Everything you need to know before you arrive.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                backgroundColor: selectedCategory === cat ? cardBg : bgColor,
                color: selectedCategory === cat ? textColor : textMuted,
                borderColor: selectedCategory === cat ? accentColor : borderCol,
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${selectedCategory === cat ? 'shadow-md' : 'hover:opacity-80'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <details key={faq.id} style={{ backgroundColor: cardBg, borderColor: borderCol, borderRadius: radius }} className="group p-5 sm:p-6 border shadow-sm">
                <summary style={{ color: textColor }} className="font-bold text-sm sm:text-base cursor-pointer flex items-center justify-between list-none">
                  <span>{faq.question}</span>
                  <ChevronRight style={{ color: accentColor }} className="w-5 h-5 group-open:rotate-90 transition-transform" />
                </summary>
                <div style={{ borderTopColor: borderCol }} className="mt-3 pt-3 border-t">
                  {renderAnswerContent(faq.answer)}
                </div>
              </details>
            ))
          ) : (
            <div style={{ backgroundColor: cardBg, borderColor: borderCol, borderRadius: radius }} className="p-12 text-center border shadow-sm">
              <p style={{ color: textMuted }} className="text-sm">No FAQs found for this category.</p>
            </div>
          )}
        </div>

        {/* Bottom Direct WhatsApp Help Banner */}
        <div
          style={{ backgroundColor: cardBg, borderColor: borderCol, borderRadius: radius }}
          className="mt-12 p-6 sm:p-8 border shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left"
        >
          <div>
            <span style={{ color: accentColor }} className="text-xs font-bold uppercase tracking-wider block mb-1">
              Still Have Questions?
            </span>
            <h3 style={{ color: textColor }} className="font-serif text-xl sm:text-2xl font-bold">
              Connect Directly with Our Team
            </h3>
            <p style={{ color: textMuted }} className="text-xs sm:text-sm mt-1">
              Get instant availability, customized group quotes, and answers on WhatsApp at <strong>{currentWhatsappDisplay}</strong>.
            </p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            id="faq-bottom-whatsapp-btn"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
