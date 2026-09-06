import React from 'react';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { BlogPost, SiteSettings } from '../types';

export interface BlogCardProps {
  key?: string | number;
  blog: BlogPost;
  onReadStory: (slug: string) => void;
  siteSettings: SiteSettings;
}

export function BlogCard({ blog, onReadStory, siteSettings }: BlogCardProps) {
  const bgColor = siteSettings.themeColors.cardBg;
  const textColor = siteSettings.themeColors.text;
  const accentColor = siteSettings.themeColors.primary;
  const textMuted = siteSettings.themeColors.textMuted;
  const borderCol = siteSettings.themeColors.border;
  const radius =
    siteSettings.themeBorderRadius === 'none'
      ? '0'
      : siteSettings.themeBorderRadius === 'sm'
      ? '0.25rem'
      : siteSettings.themeBorderRadius === 'md'
      ? '0.5rem'
      : siteSettings.themeBorderRadius === 'lg'
      ? '0.75rem'
      : siteSettings.themeBorderRadius === 'xl'
      ? '1rem'
      : '0.75rem';

  return (
    <article
      onClick={() => onReadStory(blog.slug || blog.id)}
      style={{
        backgroundColor: bgColor,
        borderColor: borderCol,
        borderRadius: radius,
      }}
      className="group flex flex-col h-full border overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      id={`blog-card-${blog.slug || blog.id}`}
    >
      {/* Featured Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
        <img
          src={blog.featuredImage || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1000&q=80'}
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Category Badge */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <span
            style={{
              backgroundColor: 'rgba(20, 41, 29, 0.85)',
              borderColor: accentColor,
              color: accentColor,
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md border shadow-md"
          >
            <BookOpen className="w-3 h-3 shrink-0" />
            <span>{blog.category || 'PAWNA LAKE'}</span>
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Date & Reading Time */}
          <div className="flex items-center gap-4 text-xs mb-3" style={{ color: textMuted }}>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" style={{ color: accentColor }} />
              {blog.publishedDate || 'Recent'}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" style={{ color: accentColor }} />
              {blog.readingTime || '4 min read'}
            </span>
          </div>

          {/* Title */}
          <h3
            style={{ color: textColor }}
            className="font-serif text-lg sm:text-xl font-medium tracking-tight leading-snug mb-2.5 group-hover:opacity-90 transition-colors line-clamp-2"
          >
            {blog.title}
          </h3>

          {/* Excerpt */}
          <p
            style={{ color: textMuted }}
            className="text-xs sm:text-sm leading-relaxed mb-5 line-clamp-3 font-sans"
          >
            {blog.excerpt}
          </p>
        </div>

        {/* Action Link */}
        <div className="pt-4 border-t" style={{ borderColor: `${borderCol}66` }}>
          <div
            style={{ color: accentColor }}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider group-hover:gap-3 transition-all"
          >
            <span>Read Story</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </article>
  );
}
