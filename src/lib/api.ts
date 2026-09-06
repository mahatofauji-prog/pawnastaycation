import {
  SiteSettings,
  Stay,
  StayPackage,
  Experience,
  GalleryItem,
  FAQItem,
  ServiceItem,
  BlogPost,
  Enquiry,
  Testimonial,
} from '../types';
import {
  INITIAL_SITE_SETTINGS,
  INITIAL_STAYS,
  INITIAL_PACKAGES,
  INITIAL_EXPERIENCES,
  INITIAL_GALLERY,
  INITIAL_FAQS,
  INITIAL_TESTIMONIALS,
  INITIAL_SERVICES,
  INITIAL_BLOGS,
} from '../data/mockData';
import { optimizeImage } from './imageOptimizer';

// Helper for cleaning path params (removes extraneous brackets like [stay-1], quotes, and spaces)
function cleanPathId(id: string): string {
  if (!id) return '';
  const cleaned = String(id).trim().replace(/^\[+|\]+$/g, '').replace(/^"+|"+$/g, '').trim();
  return encodeURIComponent(cleaned);
}

// Helper for safe fetching
async function fetchJson<T>(url: string, defaultFallback: T, options?: RequestInit): Promise<T> {
  const isMutation = options?.method && options.method !== 'GET';
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      let errMsg = `HTTP ${res.status}`;
      try {
        const parsed = JSON.parse(errText);
        if (parsed.error) errMsg = parsed.error;
      } catch (_) {
        if (errText) errMsg = errText;
      }
      throw new Error(`API request failed [${url}]: ${errMsg}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[API fetch] ${url}:`, err);
    if (isMutation) {
      throw err;
    }
    return defaultFallback;
  }
}

export const api = {
  // Settings
  getSettings: async (): Promise<SiteSettings> => {
    return fetchJson('/api/settings', INITIAL_SITE_SETTINGS);
  },
  getSiteSettings: async (): Promise<SiteSettings> => {
    return fetchJson('/api/settings', INITIAL_SITE_SETTINGS);
  },
  updateSettings: async (settings: Partial<SiteSettings>): Promise<SiteSettings> => {
    return fetchJson('/api/settings', { ...INITIAL_SITE_SETTINGS, ...settings }, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
  },
  updateSiteSettings: async (settings: Partial<SiteSettings>): Promise<SiteSettings> => {
    return fetchJson('/api/settings', { ...INITIAL_SITE_SETTINGS, ...settings }, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
  },

  // Stays
  getStays: async (): Promise<Stay[]> => {
    return fetchJson('/api/stays', INITIAL_STAYS);
  },
  getStayBySlugOrId: async (idOrSlug: string): Promise<Stay | null> => {
    const all = await api.getStays();
    const cleanId = String(idOrSlug || '').trim().replace(/^\[+|\]+$/g, '').replace(/^"+|"+$/g, '').trim();
    return all.find((s) => s.id === cleanId || s.slug === cleanId || s.id === idOrSlug || s.slug === idOrSlug) || null;
  },
  createStay: async (stay: Partial<Stay>): Promise<Stay> => {
    return fetchJson('/api/stays', stay as Stay, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stay),
    });
  },
  updateStay: async (id: string, stay: Partial<Stay>): Promise<Stay> => {
    const safeId = cleanPathId(id);
    return fetchJson(`/api/stays/${safeId}`, stay as Stay, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stay),
    });
  },
  deleteStay: async (id: string): Promise<boolean> => {
    const safeId = cleanPathId(id);
    const res = await fetchJson<{ success: boolean }>(`/api/stays/${safeId}`, { success: true }, {
      method: 'DELETE',
    });
    return res.success;
  },
  updateStaysOrder: async (ids: string[]): Promise<Stay[]> => {
    return fetchJson('/api/stays-order', INITIAL_STAYS, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
  },

  // Packages
  getPackages: async (): Promise<StayPackage[]> => {
    return fetchJson('/api/packages', INITIAL_PACKAGES);
  },
  getPackageBySlugOrId: async (idOrSlug: string): Promise<StayPackage | null> => {
    const all = await api.getPackages();
    return all.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null;
  },
  createPackage: async (pkg: Partial<StayPackage>): Promise<StayPackage> => {
    return fetchJson('/api/packages', pkg as StayPackage, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pkg),
    });
  },
  updatePackage: async (id: string, pkg: Partial<StayPackage>): Promise<StayPackage> => {
    const safeId = cleanPathId(id);
    return fetchJson(`/api/packages/${safeId}`, pkg as StayPackage, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pkg),
    });
  },
  deletePackage: async (id: string): Promise<boolean> => {
    const safeId = cleanPathId(id);
    const res = await fetchJson<{ success: boolean }>(`/api/packages/${safeId}`, { success: true }, {
      method: 'DELETE',
    });
    return res.success;
  },
  updatePackagesOrder: async (ids: string[]): Promise<StayPackage[]> => {
    return fetchJson('/api/packages-order', INITIAL_PACKAGES, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
  },

  // Experiences
  getExperiences: async (): Promise<Experience[]> => {
    return fetchJson('/api/experiences', INITIAL_EXPERIENCES);
  },
  createExperience: async (exp: Partial<Experience>): Promise<Experience> => {
    return fetchJson('/api/experiences', exp as Experience, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exp),
    });
  },
  updateExperience: async (id: string, exp: Partial<Experience>): Promise<Experience> => {
    return fetchJson(`/api/experiences/${id}`, exp as Experience, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exp),
    });
  },
  deleteExperience: async (id: string): Promise<boolean> => {
    const res = await fetchJson<{ success: boolean }>(`/api/experiences/${id}`, { success: true }, {
      method: 'DELETE',
    });
    return res.success;
  },

  // Gallery
  getGallery: async (): Promise<GalleryItem[]> => {
    return fetchJson('/api/gallery', INITIAL_GALLERY);
  },
  updateGalleryItem: async (id: string, item: Partial<GalleryItem>): Promise<GalleryItem> => {
    return fetchJson(`/api/gallery/${id}`, item as GalleryItem, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
  },
  createGalleryItem: async (item: Partial<GalleryItem>): Promise<GalleryItem> => {
    return fetchJson('/api/gallery', item as GalleryItem, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
  },
  deleteGalleryItem: async (id: string): Promise<boolean> => {
    const res = await fetchJson<{ success: boolean }>(`/api/gallery/${id}`, { success: true }, {
      method: 'DELETE',
    });
    return res.success;
  },

  // FAQs
  getFaqs: async (): Promise<FAQItem[]> => {
    return fetchJson('/api/faqs', INITIAL_FAQS);
  },
  createFaq: async (faq: Partial<FAQItem>): Promise<FAQItem> => {
    return fetchJson('/api/faqs', faq as FAQItem, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(faq),
    });
  },
  updateFaq: async (id: string, faq: Partial<FAQItem>): Promise<FAQItem> => {
    return fetchJson(`/api/faqs/${id}`, faq as FAQItem, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(faq),
    });
  },
  deleteFaq: async (id: string): Promise<boolean> => {
    const res = await fetchJson<{ success: boolean }>(`/api/faqs/${id}`, { success: true }, {
      method: 'DELETE',
    });
    return res.success;
  },

  // Enquiries
  getEnquiries: async (): Promise<Enquiry[]> => {
    return fetchJson('/api/enquiries', []);
  },
  submitEnquiry: async (enquiryData: {
    customerName: string;
    phone: string;
    email?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
    stayTypeOrName?: string;
    message?: string;
    sourcePage?: string;
  }): Promise<Enquiry> => {
    return fetchJson('/api/enquiries', {
      id: `ENQ-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: enquiryData.customerName,
      phone: enquiryData.phone,
      email: enquiryData.email || '',
      checkIn: enquiryData.checkIn || '',
      checkOut: enquiryData.checkOut || '',
      guests: enquiryData.guests || 2,
      stayTypeOrName: enquiryData.stayTypeOrName || 'General Enquiry',
      message: enquiryData.message || '',
      status: 'New',
      createdAt: new Date().toISOString(),
      sourcePage: enquiryData.sourcePage || 'Direct Submit',
    }, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiryData),
    });
  },
  updateEnquiryStatus: async (id: string, status: Enquiry['status']): Promise<Enquiry> => {
    return fetchJson(`/api/enquiries/${id}`, { id, status } as Enquiry, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  },

  // Services
  getServices: async (): Promise<ServiceItem[]> => {
    return fetchJson('/api/services', INITIAL_SERVICES);
  },
  createService: async (service: Partial<ServiceItem>): Promise<ServiceItem> => {
    return fetchJson('/api/services', service as ServiceItem, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service),
    });
  },
  updateService: async (id: string, service: Partial<ServiceItem>): Promise<ServiceItem> => {
    return fetchJson(`/api/services/${id}`, service as ServiceItem, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service),
    });
  },
  deleteService: async (id: string): Promise<boolean> => {
    const res = await fetchJson<{ success: boolean }>(`/api/services/${id}`, { success: true }, {
      method: 'DELETE',
    });
    return res.success;
  },

  // Blogs
  getBlogs: async (): Promise<BlogPost[]> => {
    return fetchJson('/api/blogs', INITIAL_BLOGS);
  },
  getBlogBySlugOrId: async (idOrSlug: string): Promise<BlogPost | null> => {
    const all = await api.getBlogs();
    return all.find((b) => b.id === idOrSlug || b.slug === idOrSlug) || null;
  },
  createBlog: async (blog: Partial<BlogPost>): Promise<BlogPost> => {
    return fetchJson('/api/blogs', blog as BlogPost, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blog),
    });
  },
  updateBlog: async (id: string, blog: Partial<BlogPost>): Promise<BlogPost> => {
    return fetchJson(`/api/blogs/${id}`, blog as BlogPost, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blog),
    });
  },
  deleteBlog: async (id: string): Promise<boolean> => {
    const res = await fetchJson<{ success: boolean }>(`/api/blogs/${id}`, { success: true }, {
      method: 'DELETE',
    });
    return res.success;
  },

  // Image Upload helper
  uploadImage: async (
    fileOrBase64: File | string,
    options?: {
      folder?: string;
      entityId?: string;
      filename?: string;
      onProgress?: (percent: number) => void;
    }
  ): Promise<string> => {
    let base64String = '';
    let mimeType = 'image/jpeg';
    let fileName = options?.filename || `img_${Date.now()}`;

    options?.onProgress?.(10);

    if (typeof fileOrBase64 === 'string') {
      base64String = fileOrBase64;
      const match = fileOrBase64.match(/^data:(image\/[a-zA-Z+]+);base64,/);
      if (match) mimeType = match[1];
    } else {
      fileName = fileOrBase64.name;
      mimeType = fileOrBase64.type || 'image/jpeg';

      // Validation
      const supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!supportedTypes.includes(fileOrBase64.type)) {
        throw new Error(`Unsupported file type: "${fileOrBase64.name}". Please select JPG, JPEG, PNG, or WEBP.`);
      }

      if (fileOrBase64.size > 10 * 1024 * 1024) {
        const sizeMb = (fileOrBase64.size / (1024 * 1024)).toFixed(1);
        throw new Error(`Image is too large (${sizeMb} MB). Maximum allowed size is 10 MB.`);
      }

      options?.onProgress?.(25);

      try {
        // Optimize the image client-side first
        const optimized = await optimizeImage(fileOrBase64, {
          maxWidth: 1600,
          maxHeight: 1600,
          quality: 0.85,
        });
        base64String = optimized.base64;
        mimeType = 'image/webp';
      } catch (err) {
        console.warn('Image optimization skipped, reading raw data:', err);
        base64String = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(fileOrBase64);
        });
      }
    }

    options?.onProgress?.(50);

    // Call native application backend /api/upload
    try {
      options?.onProgress?.(75);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64String,
          filename: fileName,
          mimeType,
          folder: options?.folder || 'accommodations',
          entityId: options?.entityId || 'general',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.url) {
          options?.onProgress?.(100);
          return data.url;
        }
      }

      // Extract actual server error message
      const errorData = await res.json().catch(() => ({}));
      const serverErrMsg =
        errorData.error || (res.status === 404 ? 'Upload service endpoint not found (404)' : `Server error (${res.status})`);
      throw new Error(serverErrMsg);
    } catch (err) {
      console.warn('[CMS Upload] Server upload endpoint failed, falling back to client-optimized image payload:', err);
      if (base64String) {
        options?.onProgress?.(100);
        return base64String;
      }
      const safeMessage =
        (err as Error).message && !(err as Error).message.includes('fetch')
          ? (err as Error).message
          : 'Upload failed. Please check network connection and try again.';
      throw new Error(safeMessage);
    }
  },

  // Testimonials
  getTestimonials: async (): Promise<Testimonial[]> => {
    return fetchJson('/api/testimonials', INITIAL_TESTIMONIALS);
  },
};
