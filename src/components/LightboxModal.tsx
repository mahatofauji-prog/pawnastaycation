import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: Array<{ url: string; title?: string; caption?: string }>;
  initialIndex?: number;
}

export function LightboxModal({ isOpen, onClose, images, initialIndex = 0 }: LightboxModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || images.length === 0) return null;

  const currentImg = images[currentIndex] || images[0];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between text-white border-b border-white/10 pb-4">
        <div>
          <h4 className="text-base font-serif font-bold text-[#EADBC8]">
            {currentImg.title || 'Pawna Lake Gallery'}
          </h4>
          <span className="text-xs text-stone-400">
            Image {currentIndex + 1} of {images.length}
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Close Lightbox"
          id="lightbox-close-btn"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        <img
          src={currentImg.url}
          alt={currentImg.title || 'Gallery image'}
          className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl select-none"
        />

        {/* Previous Button */}
        {images.length > 1 && (
          <button
            onClick={prevImage}
            className="absolute left-2 md:left-6 p-3 rounded-full bg-black/60 hover:bg-[#C5A059] text-white hover:text-[#14291D] transition-colors border border-white/20"
            aria-label="Previous Image"
            id="lightbox-prev-btn"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={nextImage}
            className="absolute right-2 md:right-6 p-3 rounded-full bg-black/60 hover:bg-[#C5A059] text-white hover:text-[#14291D] transition-colors border border-white/20"
            aria-label="Next Image"
            id="lightbox-next-btn"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Caption & Thumbnails */}
      <div className="text-center text-stone-300 text-xs md:text-sm max-w-2xl mx-auto pt-2">
        {currentImg.caption && <p className="italic bg-black/40 py-2 px-4 rounded-xl border border-white/10">{currentImg.caption}</p>}
      </div>
    </div>
  );
}
