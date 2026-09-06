import { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  Check,
  Sparkles,
  BookOpen,
  ArrowRight,
  MessageCircle,
  Tent,
} from 'lucide-react';
import { BlogPost, SiteSettings, Stay } from '../types';
import { BlogCard } from '../components/BlogCard';

interface BlogDetailPageProps {
  slugOrId: string;
  blogs: BlogPost[];
  stays: Stay[];
  siteSettings: SiteSettings;
  onNavigate: (page: string, slug?: string) => void;
  onOpenBookingModal?: (stay?: Stay) => void;
}

export function BlogDetailPage({
  slugOrId,
  blogs,
  stays,
  siteSettings,
  onNavigate,
  onOpenBookingModal,
}: BlogDetailPageProps) {
  const [copied, setCopied] = useState(false);

  const blog = useMemo(() => {
    return (
      blogs.find((b) => b.slug === slugOrId || b.id === slugOrId) ||
      blogs[0] ||
      null
    );
  }, [blogs, slugOrId]);

  const relatedBlogs = useMemo(() => {
    if (!blog) return [];
    return blogs
      .filter((b) => b.id !== blog.id && b.status !== 'Draft')
      .slice(0, 3);
  }, [blogs, blog]);

  const textColor = siteSettings.themeColors.text;
  const accentColor = siteSettings.themeColors.primary;
  const textMuted = siteSettings.themeColors.textMuted;
  const cardBg = siteSettings.themeColors.cardBg;
  const borderCol = siteSettings.themeColors.border;

  if (!blog) {
    return (
      <div className="min-h-screen py-24 text-center px-4">
        <h2 className="text-2xl font-serif mb-4" style={{ color: textColor }}>
          Story Not Found
        </h2>
        <button
          onClick={() => onNavigate('blog')}
          className="px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider"
          style={{ backgroundColor: accentColor, color: '#122319' }}
        >
          Return to All Stories
        </button>
      </div>
    );
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Read "${blog.title}" on ${siteSettings.businessName || 'Pawnastaycation'}`;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${shareText}\n\n${currentUrl}`
    )}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // Helper to render formatted blog body
  const renderFormattedContent = (content: string) => {
    const sections = content.split('\n\n');
    return sections.map((sec, idx) => {
      const trimmed = sec.trim();
      if (!trimmed) return null;

      // Heading 3 (###)
      if (trimmed.startsWith('### ')) {
        return (
          <h3
            key={idx}
            className="font-serif text-xl sm:text-2xl font-semibold mt-8 mb-4 tracking-tight"
            style={{ color: textColor }}
          >
            {trimmed.replace('### ', '')}
          </h3>
        );
      }

      // Heading 2 (##)
      if (trimmed.startsWith('## ')) {
        return (
          <h2
            key={idx}
            className="font-serif text-2xl sm:text-3xl font-semibold mt-10 mb-4 tracking-tight"
            style={{ color: textColor }}
          >
            {trimmed.replace('## ', '')}
          </h2>
        );
      }

      // Bullet List (- or *)
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed.split('\n').map((li) => li.replace(/^[-*]\s*/, '').trim());
        return (
          <ul key={idx} className="space-y-2.5 my-5 pl-2 font-sans text-sm sm:text-base leading-relaxed">
            {items.map((item, liIdx) => {
              // Parse bold text **bold**
              const parts = item.split(/(\*\*.*?\*\*)/g);
              return (
                <li key={liIdx} className="flex items-start gap-2.5" style={{ color: textColor }}>
                  <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: accentColor }} />
                  <div>
                    {parts.map((part, pIdx) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={pIdx} className="font-semibold" style={{ color: accentColor }}>{part.slice(2, -2)}</strong>;
                      }
                      return part;
                    })}
                  </div>
                </li>
              );
            })}
          </ul>
        );
      }

      // Numbered List (1. 2. 3.)
      if (/^\d+\.\s/.test(trimmed)) {
        const items = trimmed.split('\n').map((li) => li.replace(/^\d+\.\s*/, '').trim());
        return (
          <ol key={idx} className="space-y-3 my-5 pl-2 font-sans text-sm sm:text-base leading-relaxed">
            {items.map((item, liIdx) => {
              const parts = item.split(/(\*\*.*?\*\*)/g);
              return (
                <li key={liIdx} className="flex items-start gap-3" style={{ color: textColor }}>
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                    style={{ backgroundColor: `${accentColor}22`, color: accentColor, border: `1px solid ${accentColor}55` }}
                  >
                    {liIdx + 1}
                  </span>
                  <div>
                    {parts.map((part, pIdx) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={pIdx} className="font-semibold" style={{ color: accentColor }}>{part.slice(2, -2)}</strong>;
                      }
                      return part;
                    })}
                  </div>
                </li>
              );
            })}
          </ol>
        );
      }

      // Standard Paragraph
      const parts = trimmed.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={idx} className="text-sm sm:text-base leading-relaxed mb-5 font-sans" style={{ color: textColor }}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} className="font-semibold" style={{ color: accentColor }}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <article className="min-h-screen pb-24 pt-6 sm:pt-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation & Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={() => onNavigate('blog')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wider uppercase transition-colors hover:opacity-80"
            style={{ color: accentColor }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Stories</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono" style={{ color: textMuted }}>
            <span>Stories</span>
            <span>/</span>
            <span style={{ color: accentColor }}>{blog.category}</span>
          </div>
        </div>

        {/* Category Pill */}
        <div className="mb-4">
          <span
            style={{
              backgroundColor: `${accentColor}18`,
              borderColor: `${accentColor}44`,
              color: accentColor,
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{blog.category}</span>
          </span>
        </div>

        {/* Blog Article Title */}
        <h1
          className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight leading-tight mb-5"
          style={{ color: textColor }}
        >
          {blog.title}
        </h1>

        {/* Excerpt / Lead */}
        <p className="text-base sm:text-lg leading-relaxed font-sans mb-6 font-normal italic" style={{ color: textMuted }}>
          "{blog.excerpt}"
        </p>

        {/* Article Meta Bar */}
        <div
          className="flex flex-wrap items-center justify-between gap-4 py-4 border-y mb-8"
          style={{ borderColor: borderCol }}
        >
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm" style={{ color: textMuted }}>
            <span className="inline-flex items-center gap-2">
              <User className="w-4 h-4" style={{ color: accentColor }} />
              <span>{blog.author || 'Editorial Team'}</span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: accentColor }} />
              <span>{blog.publishedDate}</span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: accentColor }} />
              <span>{blog.readingTime}</span>
            </span>
          </div>

          {/* Social Share Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsAppShare}
              title="Share on WhatsApp"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleCopyLink}
              title="Copy link"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors"
              style={{
                backgroundColor: cardBg,
                borderColor: borderCol,
                color: copied ? accentColor : textColor,
              }}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Hero Featured Image */}
        <div className="relative rounded-2xl overflow-hidden border shadow-2xl mb-10 aspect-[16/9] bg-black/40" style={{ borderColor: borderCol }}>
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Formatted Article Body */}
        <div className="prose max-w-none mb-12">
          {renderFormattedContent(blog.content)}
        </div>

        {/* Inline Gallery Images if available */}
        {blog.contentImages && blog.contentImages.length > 0 && (
          <div className="my-10">
            <h4 className="font-serif text-lg font-medium mb-4" style={{ color: textColor }}>
              Visual Glimpses
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {blog.contentImages.map((imgUrl, i) => (
                <div key={i} className="rounded-xl overflow-hidden border shadow-md aspect-[4/3] bg-black/30" style={{ borderColor: borderCol }}>
                  <img src={imgUrl} alt={`Pawna story visual ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Booking Callout Card */}
        <div
          className="rounded-2xl p-6 sm:p-8 border shadow-xl my-12 relative overflow-hidden"
          style={{ backgroundColor: cardBg, borderColor: borderCol }}
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>
                <Tent className="w-4 h-4" />
                <span>PLAN YOUR PAWNA ESCAPE</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-medium mb-2" style={{ color: textColor }}>
                Experience Pawna Lake Firsthand
              </h3>
              <p className="text-xs sm:text-sm font-sans" style={{ color: textMuted }}>
                Tents starting at ₹999/person • Glamping Domes • Triangle Cottages with unlimited BBQ & Bonfire.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
              <button
                onClick={() => {
                  if (onOpenBookingModal) {
                    onOpenBookingModal(stays[0]);
                  } else {
                    onNavigate('stays');
                  }
                }}
                className="w-full md:w-auto px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
                style={{ backgroundColor: accentColor, color: '#122319' }}
              >
                Book Your Stay
              </button>
              <button
                onClick={() => onNavigate('stays')}
                className="w-full md:w-auto px-5 py-3 rounded-full font-bold text-xs uppercase tracking-wider border hover:bg-white/5 transition-all"
                style={{ borderColor: borderCol, color: textColor }}
              >
                View Stays
              </button>
            </div>
          </div>
        </div>

        {/* Related Stories */}
        {relatedBlogs.length > 0 && (
          <div className="mt-16 pt-12 border-t" style={{ borderColor: borderCol }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest block mb-1" style={{ color: accentColor }}>
                  MORE INSPIRATION
                </span>
                <h3 className="font-serif text-2xl font-medium" style={{ color: textColor }}>
                  Related Stories & Guides
                </h3>
              </div>
              <button
                onClick={() => onNavigate('blog')}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider hover:gap-2 transition-all"
                style={{ color: accentColor }}
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((rb) => (
                <BlogCard
                  key={rb.id}
                  blog={rb}
                  onReadStory={(slug) => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    onNavigate('blog-detail', slug);
                  }}
                  siteSettings={siteSettings}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
