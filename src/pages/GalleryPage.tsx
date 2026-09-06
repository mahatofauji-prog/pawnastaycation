import { useState } from 'react';
import { SiteSettings, GalleryItem } from '../types';
import { SEOHead } from '../components/SEOHead';
import { LightboxModal } from '../components/LightboxModal';

interface GalleryPageProps {
  siteSettings: SiteSettings;
  gallery?: GalleryItem[];
}

export function GalleryPage({ siteSettings, gallery = [] }: GalleryPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  const galleryImages: GalleryItem[] = (siteSettings.gallery && siteSettings.gallery.length > 0 ? siteSettings.gallery : gallery).filter(g => g.isVisible !== false);
  
  
  const categories = ['All', ...Array.from(new Set(galleryImages.map(img => img.category).filter(c => c !== 'All'))).sort()];

  const filteredImages = selectedCategory === 'All'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

  const handleOpenLightbox = (index: number) => {
    setSelectedImgIndex(index);
    setLightboxOpen(true);
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
        title={`Gallery & Photos | ${siteSettings.businessName}`}
        description={`View photos of ${siteSettings.businessName}.`}
      />

      <div style={{ backgroundColor: cardBg, color: textColor, borderBottom: `1px solid ${borderCol}` }} className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <span style={{ color: accentColor }} className="text-xs font-bold uppercase tracking-widest block mb-2">
            Visual Tour
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">
            Property Gallery
          </h1>
          <p style={{ color: textMuted }} className="text-sm sm:text-base max-w-2xl mx-auto mt-3">
            Explore our stays, beautiful surroundings, and unforgettable experiences.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
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

        {filteredImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((img, idx) => (
              <div 
                key={idx}
                className="relative aspect-square cursor-pointer group overflow-hidden"
                style={{ borderRadius: radius }}
                onClick={() => handleOpenLightbox(idx)}
              >
                <img 
                  src={img.imageUrl} 
                  alt={img.caption || `${siteSettings.businessName} gallery image`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ backgroundColor: cardBg, borderColor: borderCol, borderRadius: radius }} className="p-12 text-center border shadow-sm">
            <p style={{ color: textMuted }} className="text-sm">No images available for this category.</p>
          </div>
        )}
      </div>

      <LightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={filteredImages.map(i => ({ url: i.imageUrl, title: i.title, caption: i.caption }))}
        initialIndex={selectedImgIndex}
      />
    </div>
  );
}
