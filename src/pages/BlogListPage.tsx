import { useState, useMemo } from 'react';
import { Search, Sparkles, BookOpen, Compass, ArrowRight } from 'lucide-react';
import { BlogPost, SiteSettings } from '../types';
import { BlogCard } from '../components/BlogCard';

interface BlogListPageProps {
  blogs: BlogPost[];
  siteSettings: SiteSettings;
  onNavigate: (page: string, slug?: string) => void;
}

export function BlogListPage({ blogs, siteSettings, onNavigate }: BlogListPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const textColor = siteSettings.themeColors.text;
  const accentColor = siteSettings.themeColors.primary;
  const textMuted = siteSettings.themeColors.textMuted;
  const cardBg = siteSettings.themeColors.cardBg;
  const borderCol = siteSettings.themeColors.border;

  // Filter published blogs
  const publishedBlogs = useMemo(() => {
    return blogs
      .filter((b) => b.status !== 'Draft')
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [blogs]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    publishedBlogs.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return ['All', ...Array.from(set)];
  }, [publishedBlogs]);

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return publishedBlogs.filter((b) => {
      const matchesCat = selectedCategory === 'All' || b.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !searchQuery.trim() ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [publishedBlogs, selectedCategory, searchQuery]);

  const featuredHeroBlog = publishedBlogs.find((b) => b.featured) || publishedBlogs[0];

  return (
    <div className="min-h-screen pb-20 pt-8 sm:pt-12">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border shadow-sm"
               style={{ backgroundColor: `${accentColor}18`, borderColor: `${accentColor}40`, color: accentColor }}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>TRAVEL INSPIRATION & GUIDES</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight mb-4" style={{ color: textColor }}>
            Stories from Pawna
          </h1>
          <p className="text-sm sm:text-base leading-relaxed font-sans" style={{ color: textMuted }}>
            Discover Pawna Lake, plan your perfect getaway and get inspired for your next escape. Read our curated travel guides, packing tips, and lakeside stories.
          </p>
        </div>

        {/* Featured Story Banner (if available and not searching) */}
        {!searchQuery && selectedCategory === 'All' && featuredHeroBlog && (
          <div
            onClick={() => onNavigate('blog-detail', featuredHeroBlog.slug || featuredHeroBlog.id)}
            className="group relative rounded-2xl overflow-hidden border shadow-2xl cursor-pointer mb-12 transform hover:-translate-y-0.5 transition-all duration-300"
            style={{ backgroundColor: cardBg, borderColor: borderCol }}
            id="featured-story-banner"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[360px] sm:min-h-[420px]">
              <div className="lg:col-span-7 relative h-64 lg:h-full overflow-hidden">
                <img
                  src={featuredHeroBlog.featuredImage}
                  alt={featuredHeroBlog.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border shadow"
                        style={{ backgroundColor: 'rgba(20, 41, 29, 0.9)', borderColor: accentColor, color: accentColor }}>
                    <Compass className="w-3.5 h-3.5" />
                    <span>FEATURED STORY</span>
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs mb-3 font-mono" style={{ color: textMuted }}>
                    <span>{featuredHeroBlog.publishedDate}</span>
                    <span>•</span>
                    <span>{featuredHeroBlog.readingTime}</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-medium leading-snug mb-3.5 group-hover:opacity-90 transition-colors" style={{ color: textColor }}>
                    {featuredHeroBlog.title}
                  </h2>
                  <p className="text-sm leading-relaxed mb-6 font-sans line-clamp-4" style={{ color: textMuted }}>
                    {featuredHeroBlog.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t" style={{ borderColor: `${borderCol}66` }}>
                  <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider group-hover:gap-3 transition-all" style={{ color: accentColor }}>
                    <span>Read Full Story</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search stories, tips, guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full text-sm border focus:outline-none transition-colors"
              style={{
                backgroundColor: cardBg,
                borderColor: borderCol,
                color: textColor,
              }}
              id="blog-search-input"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="w-full md:w-auto flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    backgroundColor: isSelected ? accentColor : cardBg,
                    color: isSelected ? '#122319' : textColor,
                    borderColor: isSelected ? accentColor : borderCol,
                  }}
                  className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap border transition-all duration-200 shadow-sm"
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Blogs Grid */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onReadStory={(slug) => onNavigate('blog-detail', slug)}
                siteSettings={siteSettings}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl border" style={{ backgroundColor: cardBg, borderColor: borderCol }}>
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" style={{ color: accentColor }} />
            <h3 className="font-serif text-lg font-medium mb-1" style={{ color: textColor }}>
              No stories found
            </h3>
            <p className="text-xs sm:text-sm" style={{ color: textMuted }}>
              Try searching with different keywords or selecting "All" categories.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
